import { apiClient } from './client';
import type {
  IdeaDto,
  GenerateIdeasRequest,
  PublishJobDto,
  SchedulePublishRequest,
  AdminPostDto,
} from '@freestyle/shared';

interface List<T> { success: true; items: T[] }

export const factoryApi = {
  async listIdeas(status?: 'draft' | 'approved' | 'rejected' | 'used'): Promise<IdeaDto[]> {
    const { data } = await apiClient.get<List<IdeaDto>>('/factory/ideas', { params: status ? { status } : undefined });
    return data.items;
  },

  async generateIdeas(payload: GenerateIdeasRequest): Promise<IdeaDto[]> {
    const { data } = await apiClient.post<List<IdeaDto>>('/factory/ideas/generate', payload);
    return data.items;
  },

  async setIdeaStatus(id: string, status: 'draft' | 'approved' | 'rejected' | 'used'): Promise<IdeaDto> {
    const { data } = await apiClient.patch<{ success: true; idea: IdeaDto }>(`/factory/ideas/${id}`, { status });
    return data.idea;
  },

  async generateArticle(ideaId: string): Promise<AdminPostDto> {
    const { data } = await apiClient.post<{ success: true; post: AdminPostDto }>(`/factory/ideas/${ideaId}/article`);
    return data.post;
  },

  async listJobs(): Promise<PublishJobDto[]> {
    const { data } = await apiClient.get<List<PublishJobDto>>('/factory/jobs');
    return data.items;
  },

  async schedule(payload: SchedulePublishRequest): Promise<PublishJobDto> {
    const { data } = await apiClient.post<{ success: true; job: PublishJobDto }>('/factory/jobs', payload);
    return data.job;
  },

  async cancelJob(id: string): Promise<void> {
    await apiClient.delete(`/factory/jobs/${id}`);
  },
};
