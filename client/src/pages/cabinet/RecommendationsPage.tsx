import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * AI Recommendations — после подключения RAG (Phase 5+) станет персональной
 * подборкой направлений/отелей на основе истории брони + AI-консьерж.
 * Сейчас — анонс-плашка и направление на чат Феликса.
 */
export function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Рекомендации от Феликса</h1>

      <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 hero-gradient text-white">
        <div className="absolute inset-0 hero-overlay opacity-50" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-[11px] uppercase tracking-wider font-bold">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Скоро
          </div>
          <h2 className="font-display font-extrabold text-3xl mt-4">
            Персональные подборки на основе вашей истории
          </h2>
          <p className="text-white/85 mt-3 leading-relaxed">
            Феликс выучит ваши предпочтения по бронированиям, избранному и поиску — и будет
            предлагать направления, отели и сезонные сделки, которые вы точно полюбите.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-white text-brand-700 font-bold text-sm hover:-translate-y-0.5 transition-all"
          >
            Спросить Феликса сейчас <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <FeatureTile
          title="История бронирований"
          text="Анализирует, куда вы летаете, в каких отелях останавливаетесь."
        />
        <FeatureTile
          title="Сезонные тренды"
          text="Учитывает, когда лучше всего лететь в каждое направление."
        />
        <FeatureTile
          title="Сообщения Феликсу"
          text="Понимает контекст из ваших диалогов с AI-консьержем."
        />
      </div>
    </div>
  );
}

function FeatureTile({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-5">
      <div className="font-display font-bold text-ink-900">{title}</div>
      <p className="text-sm text-ink-500 mt-1">{text}</p>
    </div>
  );
}
