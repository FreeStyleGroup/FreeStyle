import { config } from '../../config/index.js';
import { mailTransport } from '../email/transport.js';

/**
 * Шаблоны транзакционных писем. Минималистичные, plain HTML без зависимостей.
 * Брендирование/дизайнерская верстка — отдельной итерацией (можно подключить mjml позже).
 */

function brandFooter(): string {
  return `
<p style="font-size:12px;color:#888;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">
  FreeStyle.ru · ваш персональный путешественник<br>
  Если вы не запрашивали это письмо — просто проигнорируйте его.
</p>`;
}

export const authEmailService = {
  async sendVerificationEmail(opts: {
    to: string;
    name: string;
    token: string;
  }): Promise<void> {
    const link = `${config.clientUrl}/verify-email?token=${encodeURIComponent(opts.token)}`;
    const html = `
<div style="font-family:-apple-system,Inter,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a2b47;">
  <h1 style="color:#c62828;font-size:24px;margin:0 0 8px;">Добро пожаловать, ${escapeHtml(opts.name)}!</h1>
  <p style="font-size:15px;line-height:1.5;">Подтвердите ваш email — это нужно, чтобы вы могли восстанавливать пароль и получать важные уведомления о бронированиях.</p>
  <p style="margin:24px 0;">
    <a href="${link}" style="display:inline-block;background:#c62828;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">Подтвердить email</a>
  </p>
  <p style="font-size:13px;color:#666;">Ссылка действует 24 часа. Если кнопка не работает, скопируйте адрес:<br>${link}</p>
  ${brandFooter()}
</div>`;
    await mailTransport.send({
      to: opts.to,
      subject: 'Подтвердите регистрацию на FreeStyle.ru',
      html,
      text: `Здравствуйте, ${opts.name}!\n\nПодтвердите ваш email по ссылке:\n${link}\n\nСсылка действует 24 часа.`,
    });
  },

  async sendPasswordResetEmail(opts: {
    to: string;
    name: string;
    token: string;
  }): Promise<void> {
    const link = `${config.clientUrl}/reset-password?token=${encodeURIComponent(opts.token)}`;
    const html = `
<div style="font-family:-apple-system,Inter,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a2b47;">
  <h1 style="color:#c62828;font-size:24px;margin:0 0 8px;">Восстановление пароля</h1>
  <p style="font-size:15px;line-height:1.5;">Здравствуйте, ${escapeHtml(opts.name)}! Вы запросили сброс пароля на FreeStyle.ru.</p>
  <p style="margin:24px 0;">
    <a href="${link}" style="display:inline-block;background:#c62828;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">Создать новый пароль</a>
  </p>
  <p style="font-size:13px;color:#666;">Ссылка действует 1 час. Если вы не запрашивали сброс — проигнорируйте это письмо, пароль останется прежним.</p>
  <p style="font-size:13px;color:#666;">Если кнопка не работает, скопируйте адрес:<br>${link}</p>
  ${brandFooter()}
</div>`;
    await mailTransport.send({
      to: opts.to,
      subject: 'Восстановление пароля FreeStyle.ru',
      html,
      text: `Здравствуйте, ${opts.name}!\n\nСбросьте пароль по ссылке:\n${link}\n\nСсылка действует 1 час. Если вы не запрашивали сброс — проигнорируйте.`,
    });
  },
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
