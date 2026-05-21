import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { blogApi } from '@/api/blog.api';
import type { PublicPostDto } from '@freestyle/shared';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PublicPostDto | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setPost(null); setNotFound(false);
    blogApi.getPost(slug, 'ru').then((p) => {
      if (!p) setNotFound(true);
      else {
        setPost(p);
        /** SEO — устанавливаем title/description динамически */
        if (p.seoTitle) document.title = p.seoTitle + ' · FreeStyle';
        else document.title = p.title + ' · FreeStyle';
      }
    }).catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <AlertCircle className="w-14 h-14 mx-auto text-brand-600" />
        <h1 className="font-display font-extrabold text-2xl mt-6 text-ink-900">Статья не найдена</h1>
        <p className="text-ink-500 mt-2">Возможно, её удалили или ссылка устарела.</p>
        <Link to="/blog" className="inline-block mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold">
          К списку статей
        </Link>
      </div>
    );
  }

  if (!post) {
    return <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>;
  }

  return (
    <article className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> К блогу
      </Link>

      <header className="mb-8">
        {post.categoryName && (
          <Link
            to={`/blog?category=${encodeURIComponent(post.categorySlug ?? '')}`}
            className="inline-block text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-3 hover:text-brand-700"
          >
            {post.categoryName}
          </Link>
        )}
        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink-900 leading-[1.1] tracking-tight mb-5">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-ink-500 text-lg leading-relaxed mb-5">{post.excerpt}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-[13px] text-ink-500 pb-5 border-b border-ink-100">
          {post.authorName && <span>Автор: <strong className="text-ink-900">{post.authorName}</strong></span>}
          <span>{new Date(post.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readingMinutes} мин чтения</span>
          {post.viewsCount > 0 && <span className="inline-flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.viewsCount.toLocaleString('ru-RU')}</span>}
        </div>
      </header>

      {post.coverUrl && (
        <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
          <img src={post.coverUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Контент — html уже отсанитайзен на сервере (markdown-it html:false) */}
      <div
        className="freestyle-prose"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {post.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-ink-100 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Link
              key={t}
              to={`/blog?q=${encodeURIComponent(t)}`}
              className="px-3 py-1 rounded-md bg-surface-2 text-[12.5px] font-bold text-ink-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      {/* Похожие */}
      {post.related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display font-extrabold text-2xl text-ink-900 mb-6">Читайте также</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {post.related.map((r) => (
              <Link key={r.id} to={`/blog/${r.slug}`} className="bg-white border border-ink-100 rounded-2xl overflow-hidden flex items-stretch gap-4 hover:border-brand-300 hover:shadow-sm transition-all">
                <div className="shrink-0 w-32 aspect-[4/3] bg-surface-2">
                  {r.coverUrl ? (
                    <img src={r.coverUrl} alt={r.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full grid place-items-center bg-gradient-to-br from-brand-500 to-brand-700 text-white/30">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="py-3 pr-4 flex-1 min-w-0">
                  <div className="font-bold text-ink-900 line-clamp-2 leading-snug">{r.title}</div>
                  <div className="text-[12px] text-ink-500 mt-2">{r.readingMinutes} мин · {new Date(r.publishedAt).toLocaleDateString('ru-RU')}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Стили для контента статьи (markdown-it output) */}
      <style>{`
        .freestyle-prose { color: var(--color-ink-700, #334155); font-size: 17px; line-height: 1.7; }
        .freestyle-prose h2 { font-family: var(--font-display, 'Inter'); font-weight: 800; font-size: 28px; color: #0f172a; margin: 36px 0 16px; letter-spacing: -0.015em; }
        .freestyle-prose h3 { font-family: var(--font-display, 'Inter'); font-weight: 800; font-size: 22px; color: #0f172a; margin: 28px 0 12px; }
        .freestyle-prose p { margin: 0 0 18px; }
        .freestyle-prose a { color: #c62828; font-weight: 600; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
        .freestyle-prose a:hover { color: #a31f1f; }
        .freestyle-prose ul, .freestyle-prose ol { margin: 0 0 18px; padding-left: 24px; }
        .freestyle-prose li { margin: 6px 0; }
        .freestyle-prose strong { color: #0f172a; font-weight: 700; }
        .freestyle-prose blockquote { border-left: 3px solid #c62828; margin: 24px 0; padding: 4px 0 4px 20px; color: #475569; font-style: italic; }
        .freestyle-prose code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 14.5px; }
        .freestyle-prose img { border-radius: 12px; margin: 24px 0; max-width: 100%; height: auto; }
        .freestyle-prose hr { border: 0; border-top: 1px solid #e2e8f0; margin: 36px 0; }
      `}</style>
    </article>
  );
}
