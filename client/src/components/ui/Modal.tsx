import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hideClose?: boolean;
  bare?: boolean; // без белого фона/тени — для кастомных layouts (например AuthModal с боковой панелью)
}

const sizes: Record<NonNullable<ModalProps['size']>, string> = {
  sm:  'max-w-md',
  md:  'max-w-lg',
  lg:  'max-w-2xl',
  xl:  'max-w-4xl',
  '2xl': 'max-w-5xl',
};

export function Modal({ isOpen, onClose, children, size = 'sm', hideClose, bare }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/60 backdrop-blur-md p-4 animate-modal-in"
      onClick={onClose}
    >
      <div
        className={cn(
          'w-full relative',
          sizes[size],
          !bare && 'bg-white rounded-3xl shadow-2xl overflow-hidden',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-md text-ink-700 hover:text-ink-900 grid place-items-center transition-all cursor-pointer hover:scale-105"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
