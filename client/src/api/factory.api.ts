import { apiClient } from './client';
import { isPreview, mockIdeas, mockJobs } from '@/lib/preview';
import type {
  IdeaDto,
  GenerateIdeasRequest,
  PublishJobDto,
  SchedulePublishRequest,
  AdminPostDto,
} from '@freestyle/shared';

interface List<T> { success: true; items: T[] }

async function pv<T>(real: () => Promise<T>, mock: () => T): Promise<T> {
  if (isPreview()) {
    try { return await real(); } catch { return mock(); }
  }
  return real();
}

export const factoryApi = {
  listIdeas: (status?: 'draft' | 'approved' | 'rejected' | 'used') => pv<IdeaDto[]>(
    async () => (await apiClient.get<List<IdeaDto>>('/factory/ideas', { params: status ? { status } : undefined })).data.items,
    () => status ? mockIdeas.filter((i) => i.status === status) : mockIdeas,
  ),

  generateIdeas: (payload: GenerateIdeasRequest) => pv<IdeaDto[]>(
    async () => (await apiClient.post<List<IdeaDto>>('/factory/ideas/generate', payload)).data.items,
    () => mockIdeas.slice(0, payload.count ?? 5),
  ),

  async setIdeaStatus(id: string, status: 'draft' | 'approved' | 'rejected' | 'used'): Promise<IdeaDto> {
    if (isPreview()) return { ...mockIdeas[0], status };
    const { data } = await apiClient.patch<{ success: true; idea: IdeaDto }>(`/factory/ideas/${id}`, { status });
    return data.idea;
  },

  async generateArticle(ideaId: string): Promise<AdminPostDto> {
    if (isPreview()) {
      return { id: 'preview-' + ideaId, slug: 'ai-generated-preview', locale: 'ru', title: 'AI-сгенерированная статья (preview)', excerpt: 'Краткое содержание', contentMd: '# Заголовок\n\nКонтент', contentHtml: '<h1>Заголовок</h1><p>Контент</p>', coverUrl: null, categoryId: null, authorId: null, status: 'draft', publishedAt: null, scheduledAt: null, viewsCount: 0, readingMinutes: 5, seoTitle: null, seoDescription: null, seoKeywords: null, tags: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    }
    const { data } = await apiClient.post<{ success: true; post: AdminPostDto }>(`/factory/ideas/${ideaId}/article`);
    return data.post;
  },

  listJobs: () => pv<PublishJobDto[]>(
    async () => (await apiClient.get<List<PublishJobDto>>('/factory/jobs')).data.items,
    () => mockJobs,
  ),

  async schedule(payload: SchedulePublishRequest): Promise<PublishJobDto> {
    if (isPreview()) return { ...mockJobs[0], postId: payload.postId, channel: payload.channel, scheduledAt: payload.scheduledAt };
    const { data } = await apiClient.post<{ success: true; job: PublishJobDto }>('/factory/jobs', payload);
    return data.job;
  },

  async cancelJob(id: string): Promise<void> {
    if (isPreview()) return;
    await apiClient.delete(`/factory/jobs/${id}`);
  },
};
