import { db } from '../../db/index.js';
import { posts, auditLog } from '../../db/schema.js';
import { aiClient } from '../ai/client.js';
import { ideasService } from './ideas.service.js';
import MarkdownIt from 'markdown-it';
import { eq } from 'drizzle-orm';
import type { AdminPostDto, AuthLocale } from '@freestyle/shared';

const md = new MarkdownIt({ html: false, linkify: true });

function slugify(input: string, locale: AuthLocale): string {
  const transliterated = locale === 'ru'
    ? input.toLowerCase()
        .replace(/[а-яё]/gi, (c) => RU_TRANSLIT[c.toLowerCase()] ?? '')
    : input.toLowerCase();
  return transliterated
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || `post-${Date.now().toString(36)}`;
}

const RU_TRANSLIT: Record<string, string> = {
  а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',
  н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'shch',
  ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
};

interface ArticleGenerationResult {
  title: string;
  excerpt: string;
  contentMd: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  tags: string[];
}

const SYSTEM_PROMPT = (locale: AuthLocale) => `Ты — старший редактор премиум travel-блога FreeStyle.ru.
Пишешь полноценные статьи в Markdown, на ${locale === 'ru' ? 'русском языке' : locale === 'en' ? 'английском' : 'китайском'} для аудитории состоятельных путешественников.
Структура статьи:
- Введение (2-3 абзаца), задаёт ценность для читателя
- 3-5 разделов с **жирными подзаголовками** (## H2), внутри — конкретные факты, советы, цифры, маршруты
- Заключение с практическим выводом
- Минимум 800 слов
Стиль: глянец, premium-эстетика, factual, конкретные имена районов/отелей/маршрутов. Никаких клише.
Возвращай ТОЛЬКО JSON: { "title", "excerpt" (160 chars), "contentMd" (полный Markdown), "seoTitle", "seoDescription" (160 chars), "seoKeywords" (через запятую), "tags" (string[]) }.`;

export const articleService = {
  async generateFromIdea(actorId: string, ideaId: string): Promise<AdminPostDto> {
    const idea = await ideasService.getById(ideaId);
    if (!idea) throw new Error('Idea not found');

    const ai = await aiClient.chatJson<ArticleGenerationResult>({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT(idea.locale) },
        {
          role: 'user',
          content: `Тема: ${idea.title}\n\nOutline:\n${idea.outline ?? '(нет outline)'}\n\nКлючевые слова: ${idea.keywords.join(', ')}\n\nНапиши статью.`,
        },
      ],
      temperature: 0.75,
      maxTokens: 4_000,
    });

    const slug = slugify(ai.title || idea.title, idea.locale);
    const contentHtml = md.render(ai.contentMd);
    const words = ai.contentMd.split(/\s+/).filter(Boolean).length;

    const [created] = await db
      .insert(posts)
      .values({
        slug,
        locale: idea.locale,
        title: ai.title || idea.title,
        excerpt: ai.excerpt ?? null,
        contentMd: ai.contentMd,
        contentHtml,
        categoryId: idea.categoryId,
        authorId: actorId,
        status: 'draft',
        seoTitle: ai.seoTitle ?? null,
        seoDescription: ai.seoDescription ?? null,
        seoKeywords: ai.seoKeywords ?? null,
        tags: ai.tags ?? [],
        readingMinutes: Math.max(1, Math.round(words / 200)),
      })
      .returning();

    await ideasService.markUsed(ideaId, created.id);
    await db.insert(auditLog).values({
      actorId,
      action: 'article.generate',
      entityType: 'post',
      entityId: created.id,
      meta: { from_idea: ideaId },
    });

    return {
      id: created.id,
      slug: created.slug,
      locale: created.locale,
      title: created.title,
      excerpt: created.excerpt,
      contentMd: created.contentMd,
      contentHtml: created.contentHtml,
      coverUrl: created.coverUrl,
      categoryId: created.categoryId,
      authorId: created.authorId,
      status: created.status,
      publishedAt: created.publishedAt?.toISOString() ?? null,
      scheduledAt: created.scheduledAt?.toISOString() ?? null,
      viewsCount: created.viewsCount,
      readingMinutes: created.readingMinutes,
      seoTitle: created.seoTitle,
      seoDescription: created.seoDescription,
      seoKeywords: created.seoKeywords,
      tags: created.tags,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  },

  /** Используется планировщиком: переводит пост в published. */
  async publishNow(postId: string): Promise<void> {
    await db
      .update(posts)
      .set({ status: 'published', publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(posts.id, postId));
  },
};
