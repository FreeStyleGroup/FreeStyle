import { useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { ru } from 'date-fns/locale';
import { format } from 'date-fns';
import { FieldCard } from './FieldCard';
import { Popup } from './Popup';
import './date-field.css';

/**
 * DateField — два смежных поля «Туда / Обратно» с общим попапом-календарём
 * на 2 месяца (react-day-picker, mode=range).
 */

interface DateFieldProps {
  range: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  fromClassName?: string;
  toClassName?: string;
}

export function DateField({ range, onChange, fromClassName, toClassName }: DateFieldProps) {
  const [open, setOpen] = useState<'from' | 'to' | null>(null);

  const fmtValue = (d?: Date) => (d ? format(d, 'd MMM', { locale: ru }) : null);
  const fmtSub = (d?: Date) => (d ? format(d, 'EEEE', { locale: ru }) : null);

  // Когда диапазон выбран целиком — закрываем popup
  const handleSelect = (r: DateRange | undefined) => {
    onChange(r);
    if (r?.from && r?.to) {
      setTimeout(() => setOpen(null), 200);
    }
  };

  return (
    <>
      <div data-field className={`relative ${fromClassName ?? ''}`}>
        <FieldCard
          label="Туда"
          value={fmtValue(range?.from)}
          sub={fmtSub(range?.from)}
          placeholder="Выберите дату"
          isOpen={open === 'from'}
          onClick={() => setOpen(open === 'from' ? null : 'from')}
        />
        <Popup isOpen={open === 'from'} onClose={() => setOpen(null)} width="min(640px, calc(100vw - 40px))" align="center">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={ru}
            disabled={{ before: new Date() }}
            showOutsideDays={false}
            ISOWeek
          />
        </Popup>
      </div>

      <div data-field className={`relative ${toClassName ?? ''}`}>
        <FieldCard
          label="Обратно"
          value={fmtValue(range?.to)}
          sub={fmtSub(range?.to) ?? (range?.from ? 'или в одну сторону' : null)}
          placeholder="Опционально"
          isOpen={open === 'to'}
          onClick={() => setOpen(open === 'to' ? null : 'to')}
        />
        <Popup isOpen={open === 'to'} onClose={() => setOpen(null)} width="min(640px, calc(100vw - 40px))" align="right">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={ru}
            disabled={{ before: new Date() }}
            showOutsideDays={false}
            ISOWeek
          />
        </Popup>
      </div>
    </>
  );
}
