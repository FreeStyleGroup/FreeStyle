import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, Search, Clock, Eye, BookOpen, ArrowRight } from 'lucide-react';
import { blogApi } from '@/api/blog.api';
import type { PublicPostsListResponse, PublicCategoryDto } from '@freestyle/shared';

export function BlogPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? '';
  const search = params.get('q') ?? '';
  const page = Math.max(1, Number(params.get('page')) || 1);

  const [data, setData] = useState<PublicPostsListResponse | null>(null);
  const [categories, setCategories] = useState<PublicCategoryDto[]>([]);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    blogApi.listCategories('ru').then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setData(null);
    blogApi
      .listPosts({
        locale: 'ru',
        category: category || undefined,
        q: search || undefined,
        page,
        pageSize: 12,
      })
      .then(setData)
      .catch(() => setData({ items: [], meta: { total: 0, page: 1, pageSize: 12 } }));
  }, [category, search, page]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (searchInput) next.set('q', searchInput); else next.delete('q');
    next.delete('page');
    setParams(next);
  };

  const setCat = (slug: string) => {
    const next = new URLSearchParams(params);
    if (slug) next.set('category', slug); else next.delete('category');
    next.delete('page');
    setParams(next);
  };

  const setPage = (p: number) => {
    const next = new URLSearchParams(params);
    if (p > 1) next.set('page', String(p)); else next.delete('page');
    setParams(next);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
      <header className="mb-10">
        <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-3">
          Блог FreeStyle
        </div>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink-900 leading-tight tracking-tight mb-4">
          Истории, гайды и направления
        </h1>
        <p className="text-ink-500 text-lg max-w-2xl">
          Куда лететь, что делать на месте, как сэкономить и оформить визу — пишем то, что сами хотели бы прочитать.
        </p>
      </header>

      {/* Filter + Search */}
      <div className="bg-white border border-ink-100 rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-3">
        <form onSubmit={submitSearch} className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Поиск статьи…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-ink-200 rounded-xl text-sm outline-none focus:border-brand-500"
          />
        </form>
        <div className="flex flex-wrap gap-1.5">
          <Chip active={!category} onClick={() => setCat('')}>Все</Chip>
          {categories.filter((c) => c.postsCount > 0).map((c) => (
            <Chip key={c.id} active={category === c.slug} onClick={() => setCat(c.slug)}>
              {c.name} <span className="opacity-60 ml-1">{c.postsCount}</span>
            </Chip>
          ))}
        </div>
      </div>

      {/* Posts */}
      {!data ? (
        <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : data.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 p-12 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-ink-300" />
          <p className="mt-3 text-ink-500">
            {search ? `По запросу «${search}» ничего не нашли.` : 'В этой категории пока нет статей.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((p) => (
              <article key={p.id} className="bg-white border border-ink-100 rounded-2xl overflow-hidden flex flex-col hover:border-brand-300 hover:shadow-sm transition-all">
                <Link to={`/blog/${p.slug}`} className="block aspect-[16/9] bg-surface-2 relative overflow-hidden">
                  {p.coverUrl ? (
                    <img src={p.coverUrl} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full grid place-items-center bg-gradient-to-br from-brand-500 to-brand-700 text-white/30">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}
                  {p.categoryName && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur text-[11px] uppercase font-bold tracking-wider text-ink-900">
                      {p.categoryName}
                    </span>
                  )}
                </Link>
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="font-display font-bold text-lg text-ink-900 leading-snug mb-2">
                    <Link to={`/blog/${p.slug}`} className="hover:text-brand-600 transition-colors">{p.title}</Link>
                  </h2>
                  {p.excerpt && <p className="text-sm text-ink-500 leading-relaxed line-clamp-3 mb-4">{p.excerpt}</p>}
                  <div className="mt-auto flex items-center gap-3 text-[12px] text-ink-500">
                    <span>{new Date(p.publishedAt).toLocaleDateString('ru-RU')}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{p.readingMinutes} мин</span>
                    {p.viewsCount > 0 && <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" />{p.viewsCount.toLocaleString('ru-RU')}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {Math.ceil(data.meta.total / data.meta.pageSize) > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button type="button" onClick={() => setPage(data.meta.page - 1)} disabled={data.meta.page <= 1}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-ink-700 border border-ink-200 hover:border-ink-300 hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold">
                ← Назад
              </button>
              <span className="px-4 text-sm text-ink-500">
                Стр. {data.meta.page} из {Math.ceil(data.meta.total / data.meta.pageSize)}
              </span>
              <button type="button" onClick={() => setPage(data.meta.page + 1)} disabled={data.meta.page * data.meta.pageSize >= data.meta.total}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-ink-700 border border-ink-200 hover:border-ink-300 hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold">
                Вперёд <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-lg text-[12.5px] font-bold transition-colors ${
        active ? 'bg-brand-600 text-white' : 'bg-surface-2 text-ink-700 hover:bg-ink-100'
      }`}
    >
      {children}
    </button>
  );
}
