import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin.api';
import type { AdminPostDto, AdminCategoryDto, AuthLocale } from '@freestyle/shared';
import { isAxiosError } from 'axios';

type Status = 'draft' | 'scheduled' | 'published' | 'archived';

export function AdminPostEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [post, setPost] = useState<AdminPostDto | null>(null);
  const [categories, setCategories] = useState<AdminCategoryDto[]>([]);

  const [slug, setSlug] = useState('');
  const [locale, setLocale] = useState<AuthLocale>('ru');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [contentMd, setContentMd] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [status, setStatus] = useState<Status>('draft');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [tags, setTags] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.listCategories().then(setCategories).catch(() => setCategories([]));
    if (isNew || !id) return;
    adminApi.getPost(id).then((p) => {
      setPost(p);
      setSlug(p.slug); setLocale(p.locale); setTitle(p.title);
      setExcerpt(p.excerpt ?? ''); setContentMd(p.contentMd);
      setCoverUrl(p.coverUrl ?? ''); setCategoryId(p.categoryId ?? '');
      setStatus(p.status); setSeoTitle(p.seoTitle ?? '');
      setSeoDescription(p.seoDescription ?? ''); setSeoKeywords(p.seoKeywords ?? '');
      setTags(p.tags.join(', '));
    }).catch(() => setError('Не удалось загрузить статью'));
  }, [id, isNew]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSaving(true);
    try {
      const payload = {
        slug, locale, title,
        excerpt: excerpt || undefined,
        contentMd,
        coverUrl: coverUrl || undefined,
        categoryId: categoryId || null,
        status,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        seoKeywords: seoKeywords || undefined,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const saved = isNew
        ? await adminApi.createPost(payload)
        : await adminApi.updatePost(id!, payload);
      if (isNew) navigate(`/admin/posts/${saved.id}`, { replace: true });
      else setPost(saved);
    } catch (err) {
      const msg = isAxiosError(err) ? (err.response?.data as { error?: string; details?: { message: string }[] } | undefined) : null;
      setError(msg?.details?.[0]?.message ?? msg?.error ?? 'Не удалось сохранить');
    } finally { setSaving(false); }
  };

  const remove = async () => {
    if (!post || !confirm('Удалить статью?')) return;
    await adminApi.deletePost(post.id);
    navigate('/admin/posts');
  };

  return (
    <div className="space-y-5">
      <Link to="/admin/posts" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900">
        <ArrowLeft className="w-4 h-4" /> К списку
      </Link>

      <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">
        {isNew ? 'Новая статья' : 'Редактирование'}
      </h1>

      <form onSubmit={save} className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-4">
          <Field label="Заголовок *"><input value={title} onChange={(e) => setTitle(e.target.value)} required className="input" /></Field>
          <Field label="Slug *"><input value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="bali-2026" className="input font-mono" /></Field>
          <Field label="Excerpt">
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="input" />
          </Field>
          <Field label="Content (Markdown) *">
            <textarea value={contentMd} onChange={(e) => setContentMd(e.target.value)} rows={20} required className="input font-mono text-[13px]" />
          </Field>
          {error && <div className="text-sm rounded-xl px-4 py-3 bg-brand-50 border border-brand-200 text-brand-700">{error}</div>}
        </div>

        <aside className="space-y-4">
          <div className="bg-white border border-ink-100 rounded-2xl p-4 space-y-3">
            <Field label="Статус">
              <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className="input">
                <option value="draft">draft</option>
                <option value="scheduled">scheduled</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </Field>
            <Field label="Язык">
              <select value={locale} onChange={(e) => setLocale(e.target.value as AuthLocale)} className="input">
                <option value="ru">ru</option><option value="en">en</option><option value="zh">zh</option>
              </select>
            </Field>
            <Field label="Категория">
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input">
                <option value="">—</option>
                {categories.filter((c) => c.locale === locale).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Cover URL"><input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} className="input" placeholder="https://..." /></Field>
            <Field label="Теги (через запятую)"><input value={tags} onChange={(e) => setTags(e.target.value)} className="input" placeholder="бали, виза" /></Field>
          </div>

          <div className="bg-white border border-ink-100 rounded-2xl p-4 space-y-3">
            <div className="text-[11px] uppercase tracking-wider font-bold text-ink-500">SEO</div>
            <Field label="SEO Title"><input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="input" /></Field>
            <Field label="SEO Description"><textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} className="input" /></Field>
            <Field label="SEO Keywords"><input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} className="input" /></Field>
          </div>

          <button type="submit" disabled={saving} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ink-900 text-white font-bold text-sm hover:bg-ink-800 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Сохранить</>}
          </button>
          {!isNew && (
            <button type="button" onClick={() => void remove()} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-coral-700 hover:bg-coral-50 font-bold text-sm">
              <Trash2 className="w-4 h-4" /> Удалить
            </button>
          )}
        </aside>
      </form>

      {/* Inline tailwind helper — applied via class binding above */}
      <style>{`
        .input { width: 100%; padding: 0.625rem 0.9rem; background: white; border: 1px solid var(--color-ink-200, #e5e7eb); border-radius: 0.75rem; font-size: 14px; outline: none; }
        .input:focus { border-color: var(--color-brand-500, #c62828); box-shadow: 0 0 0 3px rgba(198,40,40,0.12); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-[.1em] font-bold text-ink-500 mb-1.5">{label}</div>
      {children}
    </label>
  );
}
