import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, Wand2, Check, X as XIcon, FileText, Calendar, Loader2,
} from 'lucide-react';
import { factoryApi } from '@/api/factory.api';
import type { IdeaDto, PublishJobDto, AuthLocale } from '@freestyle/shared';
import { isAxiosError } from 'axios';

type Tab = 'ideas' | 'jobs';

export function AdminFactoryPage() {
  const [tab, setTab] = useState<Tab>('ideas');

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Контент-завод</h1>
        <p className="text-ink-500 mt-1">AI-генерация идей и статей, расписание автопубликации.</p>
      </header>

      <div className="inline-flex bg-surface-2 rounded-xl p-1.5">
        {(['ideas', 'jobs'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${tab === t ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'}`}>
            {t === 'ideas' ? 'Идеи · Статьи' : 'Расписание публикаций'}
          </button>
        ))}
      </div>

      {tab === 'ideas' ? <IdeasPanel /> : <JobsPanel />}
    </div>
  );
}

/* ─────────────────────────────────────
   IDEAS + ARTICLE GENERATION
   ───────────────────────────────────── */

function IdeasPanel() {
  const navigate = useNavigate();
  const [items, setItems] = useState<IdeaDto[] | null>(null);
  const [filter, setFilter] = useState<'draft' | 'approved' | 'rejected' | 'used' | ''>('');

  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [locale, setLocale] = useState<AuthLocale>('ru');
  const [generating, setGenerating] = useState(false);
  const [generatingArticleFor, setGeneratingArticleFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setItems(null);
    factoryApi.listIdeas(filter || undefined).then(setItems).catch(() => setItems([]));
  };
  useEffect(load, [filter]);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setGenerating(true);
    try {
      await factoryApi.generateIdeas({ topic, count, locale });
      setTopic('');
      load();
    } catch (err) {
      const msg = isAxiosError(err) ? (err.response?.data as { error?: string })?.error : null;
      setError(msg ?? 'Не удалось сгенерировать (проверьте AITUNNEL_API_KEY).');
    } finally { setGenerating(false); }
  };

  const setStatus = async (id: string, s: 'draft' | 'approved' | 'rejected') => {
    await factoryApi.setIdeaStatus(id, s);
    load();
  };

  const writeArticle = async (id: string) => {
    setGeneratingArticleFor(id);
    try {
      const post = await factoryApi.generateArticle(id);
      navigate(`/admin/posts/${post.id}`);
    } catch (err) {
      const msg = isAxiosError(err) ? (err.response?.data as { error?: string })?.error : null;
      setError(msg ?? 'Не удалось сгенерировать статью');
    } finally { setGeneratingArticleFor(null); }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={generate} className="bg-white border border-ink-100 rounded-2xl p-5 grid sm:grid-cols-[1fr_140px_140px_auto] gap-3 items-end">
        <label className="block">
          <div className="text-[11px] uppercase tracking-[.1em] font-bold text-ink-500 mb-1.5">Тема</div>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Премиум-туры в Японию весной"
            required
            className="w-full px-4 py-2.5 bg-white border border-ink-200 rounded-xl text-sm outline-none focus:border-brand-500"
          />
        </label>
        <label className="block">
          <div className="text-[11px] uppercase tracking-[.1em] font-bold text-ink-500 mb-1.5">Кол-во</div>
          <input
            type="number" min={1} max={10}
            value={count} onChange={(e) => setCount(Math.max(1, Math.min(10, Number(e.target.value) || 5)))}
            className="w-full px-4 py-2.5 bg-white border border-ink-200 rounded-xl text-sm outline-none focus:border-brand-500"
          />
        </label>
        <label className="block">
          <div className="text-[11px] uppercase tracking-[.1em] font-bold text-ink-500 mb-1.5">Язык</div>
          <select value={locale} onChange={(e) => setLocale(e.target.value as AuthLocale)} className="w-full px-3 py-2.5 bg-white border border-ink-200 rounded-xl text-sm">
            <option value="ru">ru</option><option value="en">en</option><option value="zh">zh</option>
          </select>
        </label>
        <button
          type="submit" disabled={generating}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Wand2 className="w-4 h-4" /> Сгенерировать</>}
        </button>
      </form>

      {error && <div className="text-sm rounded-xl px-4 py-3 bg-brand-50 border border-brand-200 text-brand-700">{error}</div>}

      <div className="inline-flex bg-surface-2 rounded-xl p-1">
        {(['', 'draft', 'approved', 'used', 'rejected'] as const).map((f) => (
          <button key={f || 'all'} type="button" onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-[12.5px] font-bold transition-colors ${filter === f ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'}`}>
            {f === '' ? 'Все' : f}
          </button>
        ))}
      </div>

      {!items ? (
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 p-12 text-center">
          <Sparkles className="w-12 h-12 mx-auto text-ink-300" />
          <p className="mt-3 text-ink-500">Идей пока нет — задайте тему выше и нажмите «Сгенерировать».</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((i) => (
            <div key={i.id} className="bg-white border border-ink-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex px-2 py-0.5 rounded-md text-[10.5px] font-bold uppercase bg-ink-100 text-ink-700">{i.status}</span>
                    <span className="text-[11px] text-ink-400">{i.locale} · {new Date(i.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="font-display font-bold text-ink-900">{i.title}</div>
                  {i.outline && <div className="text-[13px] text-ink-500 mt-1 whitespace-pre-line line-clamp-3">{i.outline}</div>}
                  {i.keywords.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {i.keywords.slice(0, 8).map((k) => (
                        <span key={k} className="px-2 py-0.5 rounded-md bg-surface-2 text-[11px] text-ink-700">{k}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  {i.status === 'used' && i.resultingPostId ? (
                    <Link to={`/admin/posts/${i.resultingPostId}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-bold text-brand-600 hover:bg-brand-50">
                      <FileText className="w-3.5 h-3.5" /> Статья
                    </Link>
                  ) : (
                    <>
                      <button type="button" onClick={() => void writeArticle(i.id)} disabled={generatingArticleFor === i.id} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-bold text-white bg-ink-900 hover:bg-ink-800 disabled:opacity-50">
                        {generatingArticleFor === i.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Wand2 className="w-3.5 h-3.5" /> Написать</>}
                      </button>
                      {i.status !== 'approved' && (
                        <button type="button" onClick={() => void setStatus(i.id, 'approved')} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-bold text-mint-700 hover:bg-mint-500/10">
                          <Check className="w-3.5 h-3.5" /> Одобрить
                        </button>
                      )}
                      {i.status !== 'rejected' && (
                        <button type="button" onClick={() => void setStatus(i.id, 'rejected')} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-bold text-coral-700 hover:bg-coral-50">
                          <XIcon className="w-3.5 h-3.5" /> Отклонить
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────
   PUBLISH JOBS
   ───────────────────────────────────── */

function JobsPanel() {
  const [items, setItems] = useState<PublishJobDto[] | null>(null);

  const load = () => { setItems(null); factoryApi.listJobs().then(setItems).catch(() => setItems([])); };
  useEffect(load, []);

  const cancel = async (id: string) => {
    if (!confirm('Отменить публикацию?')) return;
    await factoryApi.cancelJob(id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-ink-700">
        <strong>Расписание:</strong> сейчас активен канал <code>site</code>. Telegram, Дзен и VK будут добавлены отдельным релизом, когда подключим API-ключи каналов. Запланировать публикацию на сайт можно из редактора статьи (Phase 4) или через POST <code>/api/factory/jobs</code>.
      </div>

      {!items ? (
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 p-12 text-center">
          <Calendar className="w-12 h-12 mx-auto text-ink-300" />
          <p className="mt-3 text-ink-500">Запланированных публикаций пока нет.</p>
        </div>
      ) : (
        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
              <tr>
                <th className="px-4 py-3">Когда</th><th className="px-4 py-3">Статья</th>
                <th className="px-4 py-3">Канал</th><th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Попыток</th><th />
              </tr>
            </thead>
            <tbody>
              {items.map((j) => (
                <tr key={j.id} className="border-t border-ink-100">
                  <td className="px-4 py-3 whitespace-nowrap text-ink-700">{new Date(j.scheduledAt).toLocaleString('ru-RU')}</td>
                  <td className="px-4 py-3"><Link to={`/admin/posts/${j.postId}`} className="font-bold text-ink-900 hover:text-brand-600">{j.postTitle}</Link></td>
                  <td className="px-4 py-3 capitalize">{j.channel}</td>
                  <td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold uppercase bg-ink-100 text-ink-700">{j.status}</span></td>
                  <td className="px-4 py-3 tabular-nums">{j.attempts}</td>
                  <td className="px-4 py-3 text-right">
                    {(j.status === 'queued' || j.status === 'failed') && (
                      <button type="button" onClick={() => void cancel(j.id)} className="text-coral-700 font-bold hover:text-coral-800 text-[12.5px]">
                        Отменить
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
