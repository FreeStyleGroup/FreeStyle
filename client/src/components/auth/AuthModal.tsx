import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialTab = 'login' }: AuthModalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        {/* Tab switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {(['login', 'register'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer',
                activeTab === tab
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700',
              )}
            >
              {t(`auth.${tab}`)}
            </button>
          ))}
        </div>

        {/* Login form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                className={inputClass}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                className={inputClass}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              {t('auth.loginButton')}
            </Button>
            <p className="text-center">
              <a href="#" className="text-sm text-primary-600 hover:underline">
                {t('auth.forgotPassword')}
              </a>
            </p>
          </form>
        )}

        {/* Register form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.name')}
              </label>
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) => setRegisterForm((p) => ({ ...p, name: e.target.value }))}
                className={inputClass}
                placeholder="Ваше имя"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))}
                className={inputClass}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))}
                className={inputClass}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              {t('auth.registerButton')}
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
}
