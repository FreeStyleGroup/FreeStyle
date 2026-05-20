import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

/**
 * FieldCard — карточка-поле в стиле China travel-v2.
 * Внутри: uppercase лейбл сверху, крупное значение, мелкая подпись.
 * Клик раскрывает popup (компоненты-обёртки управляют состоянием open).
 */
interface FieldCardProps {
  label: string;
  value?: string | null;
  sub?: string | null;
  placeholder?: string;
  isOpen?: boolean;
  onClick?: () => void;
  rightSlot?: ReactNode;       // например swap-кнопка
  className?: string;
  children?: ReactNode;         // popup рендерится сюда (relative-positioned внутри)
}

export function FieldCard({
  label, value, sub, placeholder = 'Не выбрано',
  isOpen, onClick, rightSlot, className, children,
}: FieldCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative bg-white border rounded-2xl px-5 py-3.5 cursor-pointer transition-all min-h-[74px] flex flex-col justify-center',
        isOpen
          ? 'border-brand-500 shadow-[0_0_0_3px_rgba(198,40,40,0.08)]'
          : 'border-ink-100 hover:border-ink-300',
        className,
      )}
    >
      <div className="text-[10.5px] uppercase tracking-[.1em] font-bold text-ink-400 mb-0.5">
        {label}
      </div>
      {value ? (
        <>
          <div className="font-display font-bold text-[17px] text-ink-900 leading-tight truncate">
            {value}
          </div>
          {sub && (
            <div className="text-[12px] text-ink-500 mt-0.5 truncate">
              {sub}
            </div>
          )}
        </>
      ) : (
        <div className="font-display font-medium text-[16px] text-ink-400 leading-tight">
          {placeholder}
        </div>
      )}
      {rightSlot}
      {children}
    </div>
  );
}
