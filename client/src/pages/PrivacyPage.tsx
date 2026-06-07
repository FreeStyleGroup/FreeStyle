/**
 * PrivacyPage — Политика конфиденциальности (152-ФЗ совместимый базовый текст).
 * Окончательную редакцию должен утвердить юрист.
 */
export function PrivacyPage() {
  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
      <header className="mb-10">
        <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-3">
          Защита данных
        </div>
        <h1 className="font-display font-extrabold text-4xl text-ink-900 leading-tight tracking-tight mb-2">
          Политика конфиденциальности
        </h1>
        <p className="text-ink-500">Последнее обновление: 7 июня 2026 года</p>
      </header>

      <div className="prose max-w-none space-y-6 text-[15px] leading-relaxed text-ink-700">
        <section>
          <h2 className="font-display font-extrabold text-xl text-ink-900 mt-8 mb-3">1. Кто мы и зачем эта политика</h2>
          <p>
            ООО «Фристайл» (далее — «Оператор», «мы»), ИНН 7700000000, юридический адрес: г. Москва, является оператором персональных
            данных и обрабатывает их в соответствии с Федеральным законом № 152-ФЗ «О персональных данных» от 27.07.2006.
          </p>
          <p>
            Настоящая Политика описывает какие данные мы собираем, зачем, как храним и какие у вас права. Используя сайт freestyle.ru,
            вы даёте согласие на обработку персональных данных согласно настоящей Политике.
          </p>
        </section>

        <section>
          <h2 className="font-display font-extrabold text-xl text-ink-900 mt-8 mb-3">2. Какие данные мы собираем</h2>
          <p>В зависимости от того, как вы используете Сервис, мы можем обрабатывать:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Учётные данные:</strong> email, имя, телефон, пароль (хранится в виде безопасного хеша)</li>
            <li><strong>Документы путешественника</strong> (по вашему желанию): паспорт, виза, фото — для быстрого ввода в брони</li>
            <li><strong>История бронирований:</strong> маршруты, даты, суммы, статусы</li>
            <li><strong>Технические данные:</strong> IP-адрес, user-agent, cookies, данные сессий</li>
            <li><strong>Поведенческие данные:</strong> поисковые запросы, избранное, диалоги с AI-консьержем — для персонализации</li>
            <li><strong>Платёжные данные:</strong> токенизированные через платёжного провайдера, у нас не хранятся номера карт</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-extrabold text-xl text-ink-900 mt-8 mb-3">3. Зачем мы это делаем</h2>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>исполнение договора (бронирование, доставка билетов, начисление кэшбэка)</li>
            <li>обеспечение работы личного кабинета и AI-консьержа</li>
            <li>информационная и техническая поддержка</li>
            <li>маркетинговая коммуникация (с вашего отдельного согласия)</li>
            <li>выполнение требований законодательства</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-extrabold text-xl text-ink-900 mt-8 mb-3">4. Кому мы передаём данные</h2>
          <p>Минимально необходимый круг:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Партнёрам</strong> (авиакомпании, отели, страховые) — только данные, необходимые для оформления конкретной брони</li>
            <li><strong>Платёжным провайдерам</strong> (ЮKassa, Tinkoff) — для проведения платежей</li>
            <li><strong>SMS/Email-провайдерам</strong> (для отправки уведомлений)</li>
            <li><strong>AI-провайдерам</strong> (AITunnel/OpenAI) — в обезличенном виде для работы AI-консьержа</li>
            <li><strong>Государственным органам</strong> — только по законным основаниям</li>
          </ul>
          <p>Мы не продаём ваши данные третьим лицам ни при каких условиях.</p>
        </section>

        <section>
          <h2 className="font-display font-extrabold text-xl text-ink-900 mt-8 mb-3">5. Где и как мы храним</h2>
          <p>
            Данные хранятся на серверах в Российской Федерации (reg.ru, ЦОД в Москве). Передача защищается TLS 1.3, пароли хешируются
            bcrypt (cost 12), refresh-токены хранятся в виде sha256-хешей. Доступ к базе данных имеют только администраторы с двух-факторной
            аутентификацией.
          </p>
          <p>
            Сроки хранения: до прекращения договора или отзыва согласия. После — данные обезличиваются либо удаляются в течение 90 дней.
          </p>
        </section>

        <section>
          <h2 className="font-display font-extrabold text-xl text-ink-900 mt-8 mb-3">6. Cookies и аналитика</h2>
          <p>Мы используем cookies для:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>работы авторизации (httpOnly, SameSite=Lax)</li>
            <li>запоминания настроек (язык, валюта)</li>
            <li>аналитики через Яндекс.Метрику и собственный счётчик</li>
          </ul>
          <p>
            При первом визите мы показываем баннер согласия на обработку cookie с кнопками «Принять» и «Отклонить» — согласие
            является вашим отдельным осознанным действием. Вы также можете отключить cookies в настройках браузера, но часть
            функционала перестанет работать (вход, корзина, кэшбэк).
          </p>
        </section>

        <section>
          <h2 className="font-display font-extrabold text-xl text-ink-900 mt-8 mb-3">7. Ваши права</h2>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>получить информацию о том, какие ваши данные мы обрабатываем</li>
            <li>требовать исправления неточных данных</li>
            <li>отозвать согласие на обработку (за исключением случаев, когда обработка необходима по закону)</li>
            <li>требовать удаления данных («право быть забытым»)</li>
            <li>обжаловать наши действия в Роскомнадзоре или суде</li>
          </ul>
          <p>
            Для реализации прав — напишите на <a href="mailto:privacy@freestyle.ru" className="text-brand-600 font-bold hover:underline">privacy@freestyle.ru</a>.
            Мы ответим в течение 30 дней.
          </p>
        </section>

        <section>
          <h2 className="font-display font-extrabold text-xl text-ink-900 mt-8 mb-3">8. Изменения политики</h2>
          <p>
            Мы можем обновлять политику. Существенные изменения сообщим по email и через баннер на сайте.
            Дата последнего обновления указана в начале документа.
          </p>
        </section>

        <section>
          <h2 className="font-display font-extrabold text-xl text-ink-900 mt-8 mb-3">9. Контакты</h2>
          <p>
            Оператор: ООО «Фристайл», ИНН 7700000000<br />
            По вопросам обработки персональных данных: <a href="mailto:privacy@freestyle.ru" className="text-brand-600 font-bold hover:underline">privacy@freestyle.ru</a><br />
            Регулятор: Роскомнадзор (rkn.gov.ru)
          </p>
        </section>
      </div>
    </div>
  );
}
