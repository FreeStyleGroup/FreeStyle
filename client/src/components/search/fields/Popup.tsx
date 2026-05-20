import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

/**
 * Popup — общий контейнер для раскрывающихся полей формы.
 * Закрывается по клику снаружи и по Escape.
 */
interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  align?: 'left' | 'right' | 'center';
  width?: string;
  children: ReactNode;
}

export function Popup({ isOpen, onClose, align = 'left', width, children }: PopupProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (!ref.current) return;
      // closest field-card — родительский элемент, у которого мы попап
      const fieldCard = ref.current.closest('[data-field]');
      if (fieldCard && fieldCard.contains(e.target as Node)) return;
      onClose();
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // setTimeout — чтобы click который открыл попап не закрыл его сразу
    const t = setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEsc);
    }, 0);

    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      style={width ? { width } : undefined}
      className={cn(
        'absolute top-[calc(100%+8px)] z-50 bg-white border border-ink-100 rounded-2xl shadow-[var(--shadow-hero)] p-5 animate-modal-in',
        align === 'left' && 'left-0',
        align === 'right' && 'right-0',
        align === 'center' && 'left-1/2 -translate-x-1/2',
      )}
    >
      {children}
    </div>
  );
}
