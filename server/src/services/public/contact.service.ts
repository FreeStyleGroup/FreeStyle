import { db } from '../../db/index.js';
import { contactMessages, type ContactMessage } from '../../db/schema.js';
import { mailTransport } from '../email/transport.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

interface SaveParams {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  sourcePage?: string;
  userId?: string;
  userAgent?: string;
  ip?: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const contactService = {
  async save(p: SaveParams): Promise<ContactMessage> {
    const [row] = await db
      .insert(contactMessages)
      .values({
        userId: p.userId ?? null,
        name: p.name.trim(),
        email: p.email.trim().toLowerCase(),
        phone: p.phone?.trim() || null,
        subject: p.subject?.trim() || null,
        message: p.message.trim(),
        sourcePage: p.sourcePage ?? null,
        userAgent: p.userAgent ?? null,
        ip: p.ip ?? null,
      })
      .returning();

    /** Уведомление админу (если SMTP включён) — не блокируем основной flow */
    void this.notifyAdmin(row).catch((err) => {
      logger.error({ err }, 'Contact-form admin notification failed');
    });

    return row;
  },

  async notifyAdmin(msg: ContactMessage): Promise<void> {
    if (!config.smtp.enabled) {
      logger.info(
        { id: msg.id, from: msg.email, subject: msg.subject },
        '[CONTACT:DEV] Новое сообщение из формы (SMTP отключён, не отправляю)',
      );
      return;
    }
    /** Получатель — MAIL_FROM (если задан конкретный, можно отдельный env потом) */
    const adminTo = config.smtp.from.match(/<([^>]+)>/)?.[1] ?? config.smtp.from;
    const html = `
<div style="font-family:-apple-system,Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a2b47;">
  <h2 style="color:#c62828;font-size:20px;margin:0 0 16px;">Новое сообщение из формы Контакты</h2>
  <table style="border-collapse:collapse;width:100%;font-size:14px;">
    <tr><td style="padding:6px 0;color:#666;width:30%;">Имя:</td><td><b>${escapeHtml(msg.name)}</b></td></tr>
    <tr><td style="padding:6px 0;color:#666;">Email:</td><td><a href="mailto:${escapeHtml(msg.email)}">${escapeHtml(msg.email)}</a></td></tr>
    ${msg.phone ? `<tr><td style="padding:6px 0;color:#666;">Телефон:</td><td>${escapeHtml(msg.phone)}</td></tr>` : ''}
    ${msg.subject ? `<tr><td style="padding:6px 0;color:#666;">Тема:</td><td>${escapeHtml(msg.subject)}</td></tr>` : ''}
    ${msg.sourcePage ? `<tr><td style="padding:6px 0;color:#666;">Со страницы:</td><td>${escapeHtml(msg.sourcePage)}</td></tr>` : ''}
  </table>
  <p style="margin:20px 0 8px;font-weight:600;">Сообщение:</p>
  <div style="background:#f6f6f6;border-radius:8px;padding:16px;white-space:pre-wrap;font-size:14px;line-height:1.5;">${escapeHtml(msg.message)}</div>
  <p style="font-size:12px;color:#888;margin-top:24px;border-top:1px solid #eee;padding-top:12px;">
    ID сообщения: <code>${msg.id}</code><br>
    Обработать в админке: /admin/messages (TODO)
  </p>
</div>`;
    await mailTransport.send({
      to: adminTo,
      subject: `Контакт-форма: ${msg.subject || msg.name}`,
      html,
      text: `${msg.name} <${msg.email}>\n${msg.phone ?? ''}\n\n${msg.message}\n\n---\nID: ${msg.id}`,
    });
  },
};
