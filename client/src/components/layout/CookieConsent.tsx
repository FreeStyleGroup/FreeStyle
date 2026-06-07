import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

/**
 * CookieConsent — баннер согласия на обработку cookie (152-ФЗ).
 *
 * Требования РФ (152-ФЗ, мониторинг РКН с 2025):
 *  • баннер виден сразу при входе, не спрятан в футере;
 *  • согласие — отдельное осознанное действие пользователя («Принять»);
 *  • есть возможность отказаться («Отклонить»);
 *  • ссылка на Политику конфиденциальности, где описаны cookie.
 * Решение пользователя сохраняем в localStorage, чтобы не показывать снова.
 */
const STORAGE_KEY = 'fs_cookie_consent_v1';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        // лёгкая задержка, чтобы не мешать первому рендеру и анимация была заметна
        const t = setTimeout(() => setVisible(true), 600);
        return () => clearTimeout(t);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const decide = (value: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, ts: Date.now() }));
    } catch {
      /* приватный режим — просто скрываем */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 md:px-4 md:pb-4 animate-cookie-in">
      <div className="max-w-[1320px] mx-auto bg-white border border-ink-100 rounded-2xl shadow-[var(--shadow-hover)] p-4 md:p-5 flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0">
            <Cookie className="w-5 h-5" />
          </span>
          <p className="text-[13.5px] text-ink-600 leading-relaxed">
            Мы используем файлы cookie для работы сайта, аналитики и удобства подбора путешествий.
            Продолжая пользоваться FreeStyle.ru, вы соглашаетесь с обработкой данных согласно{' '}
            <Link to="/privacy" className="text-brand-600 font-semibold hover:text-brand-700 underline-offset-2 hover:underline">
              Политике конфиденциальности
            </Link>{' '}
            и{' '}
            <Link to="/terms" className="text-brand-600 font-semibold hover:text-brand-700 underline-offset-2 hover:underline">
              Условиям использования
            </Link>.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => decide('declined')}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-ink-600 hover:text-ink-900 hover:bg-surface-2 transition-colors cursor-pointer"
          >
            Отклонить
          </button>
          <button
            type="button"
            onClick={() => decide('accepted')}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-500 to-brand-700 hover:-translate-y-0.5 transition-all shadow-md cursor-pointer"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
