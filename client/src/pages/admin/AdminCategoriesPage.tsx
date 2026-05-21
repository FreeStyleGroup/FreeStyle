import { useEffect, useState } from 'react';
import { Plus, Trash2, Tag, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin.api';
import type { AdminCategoryDto, AuthLocale } from '@freestyle/shared';

export function AdminCategoriesPage() {
  const [items, setItems] = useState<AdminCategoryDto[] | null>(null);
  const [adding, setAdding] = useState(false);

  const load = () => { setItems(null); adminApi.listCategories().then(setItems).catch(() => setItems([])); };
  useEffect(load, []);

  const remove = async (id: string) => {
    if (!confirm('Удалить категорию?')) return;
    await adminApi.deleteCategory(id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Категории</h1>
        {!adding && (
          <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ink-900 text-white font-bold text-sm hover:bg-ink-800">
            <Plus className="w-4 h-4" /> Новая
          </button>
        )}
      </div>

      {adding && <AddForm onDone={() => { setAdding(false); load(); }} onCancel={() => setAdding(false)} />}

      {!items ? (
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 p-12 text-center">
          <Tag className="w-12 h-12 mx-auto text-ink-300" />
          <p className="mt-3 text-ink-500">Категорий пока нет.</p>
        </div>
      ) : (
        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
              <tr><th className="px-4 py-3">Название</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Язык</th><th className="px-4 py-3">Sort</th><th /></tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-ink-100">
                  <td className="px-4 py-3 font-bold text-ink-900">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-[12px]">{c.slug}</td>
                  <td className="px-4 py-3">{c.locale}</td>
                  <td className="px-4 py-3 tabular-nums">{c.sortOrder}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => void remove(c.id)} className="p-2 rounded-lg text-ink-400 hover:text-coral-600 hover:bg-coral-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
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

function AddForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [locale, setLocale] = useState<AuthLocale>('ru');
  const [sortOrder, setSortOrder] = useState('0');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminApi.createCategory({ slug, name, locale, sortOrder: Number(sortOrder) });
      onDone();
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="bg-white border border-ink-100 rounded-2xl p-5 grid sm:grid-cols-4 gap-3">
      <input placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} required className="px-3 py-2 bg-white border border-ink-200 rounded-xl text-sm outline-none focus:border-brand-500" />
      <input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="px-3 py-2 bg-white border border-ink-200 rounded-xl text-sm outline-none focus:border-brand-500 font-mono" />
      <select value={locale} onChange={(e) => setLocale(e.target.value as AuthLocale)} className="px-3 py-2 bg-white border border-ink-200 rounded-xl text-sm">
        <option value="ru">ru</option><option value="en">en</option><option value="zh">zh</option>
      </select>
      <input type="number" placeholder="Sort" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="px-3 py-2 bg-white border border-ink-200 rounded-xl text-sm outline-none" />
      <div className="sm:col-span-4 flex items-center gap-2">
        <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-ink-900 text-white font-bold text-sm hover:bg-ink-800 disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Создать'}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2 rounded-xl text-ink-700 font-bold text-sm hover:bg-surface-2">Отмена</button>
      </div>
    </form>
  );
}
