import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { ideas, categories, auditLog, type Idea } from '../../db/schema.js';
import { aiClient } from '../ai/client.js';
import type { AuthLocale } from '@freestyle/shared';

export interface IdeaDto {
  id: string;
  prompt: string;
  title: string;
  outline: string | null;
  keywords: string[];
  categoryId: string | null;
  locale: AuthLocale;
  status: 'draft' | 'approved' | 'rejected' | 'used';
  resultingPostId: string | null;
  createdAt: string;
}

interface GenerateParams {
  topic: string;
  count: number;
  locale: AuthLocale;
  categoryId?: string;
  actorId: string;
}

const SYSTEM_PROMPT = (locale: AuthLocale) => `Ты — редактор travel-блога премиум-уровня для FreeStyle.ru (русскоязычная аудитория, путешествия для состоятельных людей).
Генерируешь идеи статей. Язык контента: ${locale === 'ru' ? 'русский' : locale === 'en' ? 'английский' : 'китайский'}.
Каждая идея — это: яркий цепляющий заголовок (8-14 слов), краткий outline (3-5 буллетов), 5-7 SEO-ключевиков.
Стиль: глянец, эстетика, премиум, конкретика (цены, маршруты, тонкости визы). Никаких клише типа «откройте для себя» или «уникальный опыт».`;

interface GeneratedIdea {
  title: string;
  outline: string;
  keywords: string[];
}

function toDto(i: Idea): IdeaDto {
  return {
    id: i.id,
    prompt: i.prompt,
    title: i.title,
    outline: i.outline,
    keywords: i.keywords,
    categoryId: i.categoryId,
    locale: i.locale,
    status: i.status,
    resultingPostId: i.resultingPostId,
    createdAt: i.createdAt.toISOString(),
  };
}

export const ideasService = {
  async list(filter: { status?: 'draft' | 'approved' | 'rejected' | 'used' } = {}): Promise<IdeaDto[]> {
    const rows = await db.query.ideas.findMany({
      where: filter.status ? eq(ideas.status, filter.status) : undefined,
      orderBy: [desc(ideas.createdAt)],
      limit: 200,
    });
    return rows.map(toDto);
  },

  async generate(params: GenerateParams): Promise<IdeaDto[]> {
    let categoryHint = '';
    if (params.categoryId) {
      const cat = await db.query.categories.findFirst({ where: eq(categories.id, params.categoryId) });
      if (cat) categoryHint = `\nКатегория: ${cat.name}`;
    }

    const raw = await aiClient.chatJson<{ ideas: GeneratedIdea[] }>({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT(params.locale) },
        {
          role: 'user',
          content: `Тема: ${params.topic}${categoryHint}\n\nСгенерируй ${params.count} идей статей. Верни JSON в формате: { "ideas": [{ "title": string, "outline": string, "keywords": string[] }] }.`,
        },
      ],
      temperature: 0.85,
      maxTokens: 2_500,
    });

    if (!Array.isArray(raw.ideas)) throw new Error('AI returned invalid ideas array');

    const inserted = await db
      .insert(ideas)
      .values(
        raw.ideas.map((i) => ({
          prompt: params.topic,
          title: i.title,
          outline: i.outline,
          keywords: i.keywords ?? [],
          categoryId: params.categoryId ?? null,
          locale: params.locale,
          status: 'draft' as const,
          createdById: params.actorId,
        })),
      )
      .returning();

    await db.insert(auditLog).values({
      actorId: params.actorId,
      action: 'ideas.generate',
      entityType: 'idea',
      entityId: null,
      meta: { count: inserted.length, topic: params.topic },
    });

    return inserted.map(toDto);
  },

  async setStatus(actorId: string, id: string, status: 'draft' | 'approved' | 'rejected' | 'used'): Promise<IdeaDto | null> {
    const [u] = await db
      .update(ideas)
      .set({ status, updatedAt: new Date() })
      .where(eq(ideas.id, id))
      .returning();
    if (!u) return null;
    await db.insert(auditLog).values({
      actorId,
      action: 'idea.setStatus',
      entityType: 'idea',
      entityId: id,
      meta: { status },
    });
    return toDto(u);
  },

  async getById(id: string): Promise<Idea | null> {
    const row = await db.query.ideas.findFirst({ where: eq(ideas.id, id) });
    return row ?? null;
  },

  async markUsed(id: string, postId: string): Promise<void> {
    await db
      .update(ideas)
      .set({ status: 'used', resultingPostId: postId, updatedAt: new Date() })
      .where(and(eq(ideas.id, id)));
  },
};
