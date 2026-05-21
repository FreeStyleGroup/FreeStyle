import type { Locale } from './auth';

export interface IdeaDto {
  id: string;
  prompt: string;
  title: string;
  outline: string | null;
  keywords: string[];
  categoryId: string | null;
  locale: Locale;
  status: 'draft' | 'approved' | 'rejected' | 'used';
  resultingPostId: string | null;
  createdAt: string;
}

export interface GenerateIdeasRequest {
  topic: string;
  count?: number;
  locale?: Locale;
  categoryId?: string;
}

export interface PublishJobDto {
  id: string;
  postId: string;
  postTitle: string;
  channel: 'site' | 'telegram' | 'dzen' | 'vk';
  status: 'queued' | 'running' | 'done' | 'failed' | 'cancelled';
  scheduledAt: string;
  startedAt: string | null;
  completedAt: string | null;
  externalRefId: string | null;
  attempts: number;
  lastError: string | null;
  createdAt: string;
}

export interface SchedulePublishRequest {
  postId: string;
  channel: 'site' | 'telegram' | 'dzen' | 'vk';
  scheduledAt: string;
}
