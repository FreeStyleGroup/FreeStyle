import axios, { type AxiosInstance } from 'axios';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

/**
 * AITunnel — OpenAI-совместимый proxy (RU-friendly). Поддерживает разные backend-
 * модели через единый chat/completions endpoint.
 *
 * Если ключ не задан — сервис включает stub-режим (возвращает шаблонные ответы),
 * чтобы можно было пройти flow без живого AI.
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  /** ResponseFormat для запроса JSON-объекта (поддерживается gpt-4o-mini и др.) */
  jsonMode?: boolean;
}

class AiClient {
  private http: AxiosInstance | null = null;

  private getHttp(): AxiosInstance {
    if (!this.http) {
      this.http = axios.create({
        baseURL: config.ai.baseUrl,
        timeout: 120_000,
        headers: { Authorization: `Bearer ${config.ai.apiKey}` },
      });
    }
    return this.http;
  }

  async chat(opts: ChatCompletionOptions): Promise<string> {
    if (!config.ai.enabled) {
      logger.warn('[AI:DEV] AITUNNEL_API_KEY пуст — возвращаю stub-ответ');
      return '[stub] AI не настроен. Заполните AITUNNEL_API_KEY в .env';
    }
    const { data } = await this.getHttp().post('/chat/completions', {
      model: opts.model ?? config.ai.model,
      messages: opts.messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 2_000,
      ...(opts.jsonMode ? { response_format: { type: 'json_object' } } : {}),
    });
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
      logger.error({ data }, 'AI response missing content');
      throw new Error('AI returned no content');
    }
    return content;
  }

  async chatJson<T>(opts: ChatCompletionOptions): Promise<T> {
    const raw = await this.chat({ ...opts, jsonMode: true });
    try {
      return JSON.parse(raw) as T;
    } catch (err) {
      logger.error({ raw, err }, 'AI returned invalid JSON');
      throw new Error('AI returned invalid JSON');
    }
  }
}

export const aiClient = new AiClient();
