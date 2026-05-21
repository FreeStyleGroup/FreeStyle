import nodemailer, { type Transporter } from 'nodemailer';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

export interface SendMailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Тонкая обёртка над nodemailer.
 * Если SMTP не сконфигурирован — письма логируются в консоль (dev-режим).
 * Это позволяет проходить flow регистрации без реального SMTP на старте.
 */
class MailTransport {
  private transporter: Transporter | null = null;

  private getTransporter(): Transporter {
    if (this.transporter) return this.transporter;
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.user
        ? { user: config.smtp.user, pass: config.smtp.password }
        : undefined,
    });
    return this.transporter;
  }

  async send(params: SendMailParams): Promise<void> {
    if (!config.smtp.enabled) {
      logger.warn(
        { to: params.to, subject: params.subject, body: params.text },
        '[MAIL:DEV] SMTP не настроен — письмо НЕ отправлено, логирую в консоль',
      );
      return;
    }
    const result = await this.getTransporter().sendMail({
      from: config.smtp.from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });
    logger.info({ messageId: result.messageId, to: params.to }, 'Mail sent');
  }
}

export const mailTransport = new MailTransport();
