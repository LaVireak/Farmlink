import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class GmailMailerService {
    private readonly logger = new Logger(GmailMailerService.name);
    private transporter: nodemailer.Transporter;

    constructor(private readonly config: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.config.get<string>('GMAIL_USER'),
                pass: this.config.get<string>('GMAIL_APP_PASSWORD'), // 16-character code
            },
        });
    }

    async sendOtpEmail(email: string, code: string): Promise<void> {
        const from = this.config.get<string>('GMAIL_FROM_EMAIL')
            ?? this.config.get<string>('GMAIL_USER');
        
        // Security check for development
        if (!from || !this.config.get('GMAIL_APP_PASSWORD')) {
            const env = this.config.get<string>('NODE_ENV', 'development');
            if (env === 'production') {
                throw new Error('Gmail SMTP is not configured');
            }
            this.logger.warn(`Gmail not configured. OTP for ${email}: ${code}`);
            return;
        }

        try {
            const bodyHtml = `
                <p style="margin:0 0 12px;font-size:16px;color:#2f3a2f;">Dear User,</p>
                <p style="margin:0 0 12px;font-size:16px;color:#2f3a2f;">Welcome to <strong>Farmlink</strong>!</p>
                <p style="margin:0 0 16px;font-size:15px;color:#4b5a4b;">
                    To complete your account registration and secure your access, please verify your email address using the One-Time Password (OTP) below:
                </p>
                <div style="text-align:center;background:#f1f5ef;border-radius:12px;padding:14px;margin:16px 0;font-size:28px;letter-spacing:6px;font-weight:700;color:#1b4332;">${code}</div>
                <p style="margin:0 0 8px;font-size:14px;color:#4b5a4b;">This code will expire in <strong>10 minutes</strong> for security reasons.</p>
                <p style="margin:0 0 16px;font-size:14px;color:#6b726b;">If you did not request this verification, please ignore this email.</p>
                <p style="margin:0 0 16px;font-size:14px;color:#4b5a4b;">Thank you for choosing <strong>Farmlink</strong> - connecting modern agriculture with smarter solutions.</p>
                <p style="margin:0;font-size:14px;color:#4b5a4b;">Best regards,<br><strong>The Farmlink Team</strong><br>Modern Agriculture Solutions</p>
            `;
            const html = this.buildEmailHtml('Email verification', bodyHtml);

            await this.transporter.sendMail({
                from: `"FarmLink" <${from}>`,
                to: email,
                subject: 'Farmlink email verification',
                text: `Dear User,\n\nWelcome to Farmlink!\n\nTo complete your account registration and secure your access, please verify your email address using the One-Time Password (OTP) below:\n\nYour Verification Code: ${code}\n\nThis code will expire in 10 minutes for security reasons.\n\nIf you did not request this verification, please ignore this email.\n\nThank you for choosing Farmlink - connecting modern agriculture with smarter solutions.\n\nBest regards,\nThe Farmlink Team\nModern Agriculture Solutions`,
                html,
            });
            this.logger.log(`Sent OTP email to ${email} via Gmail`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${email}`, error.stack);
            throw error;
        }
    }

    async sendPasswordResetConfirmation(email: string): Promise<void> {
        const from = this.config.get<string>('GMAIL_FROM_EMAIL')
            ?? this.config.get<string>('GMAIL_USER');

        if (!from || !this.config.get('GMAIL_APP_PASSWORD')) {
            const env = this.config.get<string>('NODE_ENV', 'development');
            if (env === 'production') {
                throw new Error('Gmail SMTP is not configured');
            }
            this.logger.warn(`Gmail not configured. Password reset confirmation for ${email} skipped.`);
            return;
        }

        try {
            const bodyHtml = `
                <p style="margin:0 0 12px;font-size:16px;color:#2f3a2f;">Dear User,</p>
                <p style="margin:0 0 12px;font-size:16px;color:#2f3a2f;">This email confirms that your <strong>Farmlink</strong> account password has been successfully reset.</p>
                <p style="margin:0 0 12px;font-size:14px;color:#4b5a4b;">If you made this change, no further action is required.</p>
                <p style="margin:0 0 12px;font-size:14px;color:#4b5a4b;">If you did not reset your password, please contact our support team immediately to help secure your account.</p>
                <p style="margin:0 0 8px;font-size:14px;color:#4b5a4b;">For your security, we recommend:</p>
                <ul style="margin:0 0 12px 18px;color:#4b5a4b;font-size:14px;">
                    <li>Using a strong and unique password</li>
                    <li>Never sharing your login credentials</li>
                    <li>Updating your password regularly</li>
                </ul>
                <p style="margin:0 0 12px;font-size:14px;color:#4b5a4b;">Thank you for choosing <strong>Farmlink</strong>.</p>
                <p style="margin:0;font-size:14px;color:#4b5a4b;">Best regards,<br><strong>The Farmlink Team</strong><br>Modern Agriculture Solutions</p>
            `;
            const html = this.buildEmailHtml('Password reset confirmation', bodyHtml);

            await this.transporter.sendMail({
                from: `"FarmLink" <${from}>`,
                to: email,
                subject: 'Farmlink password reset confirmation',
                text: 'Dear User,\n\nThis email confirms that your Farmlink account password has been successfully reset.\n\nIf you made this change, no further action is required.\n\nIf you did not reset your password, please contact our support team immediately to help secure your account.\n\nFor your security, we recommend:\n- Using a strong and unique password\n- Never sharing your login credentials\n- Updating your password regularly\n\nThank you for choosing Farmlink.\n\nBest regards,\nThe Farmlink Team\nModern Agriculture Solutions',
                                html,
            });
            this.logger.log(`Sent password reset confirmation to ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send password reset confirmation to ${email}`, error.stack);
            throw error;
        }
    }

        private buildEmailHtml(title: string, bodyHtml: string): string {
                const logoUrl = this.config.get<string>('GMAIL_LOGO_URL');
                const brand = logoUrl
                        ? `<img src="${logoUrl}" alt="FarmLink" width="120" style="display:block;margin:0 auto 12px;">`
                        : '<div style="font-size:20px;font-weight:700;color:#1b4332;text-align:center;margin-bottom:12px;">FarmLink</div>';

                return `
                        <!doctype html>
                        <html>
                            <body style="margin:0;background:#f5f6f4;font-family:Arial,Helvetica,sans-serif;">
                                <div style="max-width:520px;margin:0 auto;padding:24px;">
                                    <div style="background:#ffffff;border-radius:16px;padding:24px;box-shadow:0 10px 24px rgba(0,0,0,0.08);">
                                        ${brand}
                                        <h1 style="margin:0 0 12px;font-size:20px;color:#1f2a1f;text-align:center;">${title}</h1>
                                        ${bodyHtml}
                                    </div>
                                    <p style="margin:16px 0 0;font-size:12px;color:#8a918a;text-align:center;">
                                        FarmLink, connecting farms and markets.
                                    </p>
                                </div>
                            </body>
                        </html>
                `;
        }
}