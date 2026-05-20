import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

/**
 * BlogPreview — 3 последние статьи блога.
 * Пока тестовые placeholder, потом подключим к /api/posts.
 */

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  coverUrl: string;
  readMin: number;
}

const placeholderPosts: Post[] = [
  {
    slug: 'turkey-2026-summer',
    title: 'Турция-2026: куда лететь летом, кроме Анталии',
    excerpt: 'Каш, Бодрум, Чешме и Айвалык — четыре места которые туристы из РФ только начинают открывать. Цены, инфраструктура, особенности.',
    category: 'Гайд',
    date: '20 мая 2026',
    coverUrl: 'https://images.unsplash.com/photo-1589564236731-9bb87ee06f02?w=800&q=80&auto=format&fit=crop',
    readMin: 7,
  },
  {
    slug: 'dubai-airport-transfer',
    title: 'Как добраться из аэропорта Дубая до Marina за 25 минут',
    excerpt: 'Метро, такси, Careem, RTA автобус — сравнили все варианты по цене, времени и удобству. Что выбрать с детьми, а что в одиночку.',
    category: 'Лайфхак',
    date: '17 мая 2026',
    coverUrl: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8f5?w=800&q=80&auto=format&fit=crop',
    readMin: 5,
  },
  {
    slug: 'visa-china-2026',
    title: 'Виза в Китай для россиян: что изменилось в 2026',
    excerpt: 'Безвизовый въезд на 15 дней — для кого работает, какие документы нужны, на что обращают внимание на границе.',
    category: 'Документы',
    date: '14 мая 2026',
    coverUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80&auto=format&fit=crop',
    readMin: 9,
  },
];

export function BlogPreview() {
  return (
    <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
      <div className="flex items-end justify-between mb-8 md:mb-10 gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-600 text-[11px] font-bold tracking-[.15em] uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            Журнал
          </div>
          <h2 className="font-display text-2xl md:text-4xl font-extrabold text-ink-900 tracking-tight">
            Блог <span className="text-brand-600">о путешествиях</span>
          </h2>
          <p className="mt-3 text-ink-500 max-w-xl">
            Маршруты, гайды, лайфхаки и истории от тех, кто действительно ездит.
          </p>
        </div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors group"
        >
          Все статьи
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {placeholderPosts.map((post, i) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group bg-white border border-ink-100 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] hover:border-brand-200 animate-float-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Cover */}
            <div className="aspect-[16/10] overflow-hidden bg-surface-2 relative">
              <img
                src={post.coverUrl}
                alt={post.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold tracking-[.12em] uppercase text-brand-600">
                {post.category}
              </div>
            </div>

            {/* Body */}
            <div className="p-5 md:p-6 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs text-ink-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.date}</span>
                <span className="w-1 h-1 rounded-full bg-ink-300" />
                <span>{post.readMin} мин чтения</span>
              </div>
              <h3 className="font-display font-bold text-lg text-ink-900 leading-tight line-clamp-2 group-hover:text-brand-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-ink-500 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-1.5 text-sm font-bold text-brand-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Читать
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
