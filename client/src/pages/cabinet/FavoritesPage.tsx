import { useEffect, useState } from 'react';
import { Heart, Trash2, Loader2 } from 'lucide-react';
import { cabinetApi } from '@/api/cabinet.api';
import type { FavoriteDto } from '@freestyle/shared';

const TYPE_LABEL: Record<FavoriteDto['type'], string> = {
  flight:      'Перелёт',
  hotel:       'Отель',
  destination: 'Направление',
  post:        'Статья',
  tour:        'Тур',
};

export function FavoritesPage() {
  const [items, setItems] = useState<FavoriteDto[] | null>(null);

  useEffect(() => {
    cabinetApi.listFavorites().then(setItems).catch(() => setItems([]));
  }, []);

  const remove = async (fav: FavoriteDto) => {
    await cabinetApi.removeFavorite(fav.type, fav.refId);
    setItems((cur) => cur?.filter((f) => !(f.type === fav.type && f.refId === fav.refId)) ?? null);
  };

  if (!items) {
    return <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-5">
      <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Избранное</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 p-12 text-center">
          <Heart className="w-12 h-12 mx-auto text-ink-300" />
          <p className="mt-3 text-ink-500">Сохраняйте отели, перелёты и направления — найдёте их здесь.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((f) => {
            const payload = f.payload as { title?: string; subtitle?: string };
            return (
              <div key={`${f.type}:${f.refId}`} className="bg-white border border-ink-100 rounded-2xl p-4 flex items-start gap-3">
                <Heart className="w-5 h-5 text-brand-600 fill-brand-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10.5px] uppercase tracking-wider font-bold text-ink-500">{TYPE_LABEL[f.type]}</div>
                  <div className="font-bold text-ink-900 mt-0.5 truncate">{payload.title ?? f.refId}</div>
                  {payload.subtitle && <div className="text-[12.5px] text-ink-500 truncate">{payload.subtitle}</div>}
                </div>
                <button
                  type="button"
                  onClick={() => void remove(f)}
                  className="p-2 rounded-lg text-ink-400 hover:text-coral-600 hover:bg-coral-50 transition-colors cursor-pointer"
                  aria-label="Удалить из избранного"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
