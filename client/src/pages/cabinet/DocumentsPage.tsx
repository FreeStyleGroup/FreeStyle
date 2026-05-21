import { useEffect, useState } from 'react';
import { FileText, Plus, Trash2, Loader2 } from 'lucide-react';
import { cabinetApi } from '@/api/cabinet.api';
import type { DocumentDto, DocumentType } from '@freestyle/shared';

const TYPE_LABEL: Record<DocumentType, string> = {
  passport:         'Паспорт РФ',
  foreign_passport: 'Загранпаспорт',
  visa:             'Виза',
  id_card:          'ID-карта',
  driver_license:   'Водительские права',
  photo:            'Фото',
  other:            'Другое',
};

const TYPE_OPTIONS: DocumentType[] = [
  'passport', 'foreign_passport', 'visa', 'id_card', 'driver_license', 'photo', 'other',
];

export function DocumentsPage() {
  const [items, setItems] = useState<DocumentDto[] | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => { cabinetApi.listDocuments().then(setItems).catch(() => setItems([])); }, []);

  const onCreated = (doc: DocumentDto) => {
    setItems((cur) => cur ? [doc, ...cur] : [doc]);
    setAdding(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Удалить документ?')) return;
    await cabinetApi.deleteDocument(id);
    setItems((cur) => cur?.filter((d) => d.id !== id) ?? null);
  };

  if (!items) {
    return <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Документы</h1>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold text-sm hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Добавить
          </button>
        )}
      </div>

      {adding && <AddForm onCreated={onCreated} onCancel={() => setAdding(false)} />}

      {items.length === 0 && !adding ? (
        <div className="rounded-2xl border border-dashed border-ink-200 p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-ink-300" />
          <p className="mt-3 text-ink-500">Загрузите паспорт, визу и фото — будут подставляться в брони автоматически.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((d) => (
            <div key={d.id} className="bg-white border border-ink-100 rounded-2xl p-4 flex items-start gap-3">
              <FileText className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-[10.5px] uppercase tracking-wider font-bold text-ink-500">{TYPE_LABEL[d.type]}</div>
                <div className="font-bold text-ink-900 mt-0.5 truncate">{d.name}</div>
                <div className="text-[12.5px] text-ink-500 mt-0.5">
                  {d.number ? `№ ${d.number}` : '—'}
                  {d.expiresAt && <> · до {new Date(d.expiresAt).toLocaleDateString('ru-RU')}</>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => void remove(d.id)}
                className="p-2 rounded-lg text-ink-400 hover:text-coral-600 hover:bg-coral-50 transition-colors cursor-pointer"
                aria-label="Удалить"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddForm({ onCreated, onCancel }: { onCreated: (d: DocumentDto) => void; onCancel: () => void }) {
  const [type, setType] = useState<DocumentType>('foreign_passport');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [countryCode, setCountryCode] = useState('RU');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const doc = await cabinetApi.createDocument({
        type,
        name,
        number: number || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        countryCode: countryCode || undefined,
      });
      onCreated(doc);
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="bg-white border border-ink-100 rounded-2xl p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <div className="text-[11px] uppercase tracking-[.1em] font-bold text-ink-500 mb-1.5">Тип</div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as DocumentType)}
            className="w-full px-4 py-3 bg-white border border-ink-200 rounded-xl text-[15px] font-medium text-ink-900 outline-none focus:border-brand-500"
          >
            {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
          </select>
        </label>
        <Input label="Название" value={name} onChange={setName} required placeholder="Загранпаспорт Алексея" />
        <Input label="Номер" value={number} onChange={setNumber} placeholder="75 1234567" />
        <Input label="Страна выдачи" value={countryCode} onChange={(v) => setCountryCode(v.toUpperCase())} placeholder="RU" />
        <Input label="Действителен до" type="date" value={expiresAt} onChange={setExpiresAt} />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Добавить'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-xl text-ink-700 font-bold text-sm hover:bg-surface-2">
          Отмена
        </button>
      </div>
    </form>
  );
}

function Input({
  label, value, onChange, placeholder, type = 'text', required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-[.1em] font-bold text-ink-500 mb-1.5">
        {label}{required && <span className="text-brand-500 ml-0.5">*</span>}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-white border border-ink-200 rounded-xl text-[15px] font-medium text-ink-900 outline-none focus:border-brand-500"
      />
    </label>
  );
}
