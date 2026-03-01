import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-32 px-4">
      <div className="text-8xl font-bold text-primary-200 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('common.notFound')}</h1>
      <p className="text-gray-500 mb-8">Страница, которую вы ищете, не существует</p>
      <Link to="/">
        <Button>{t('common.backHome')}</Button>
      </Link>
    </div>
  );
}
