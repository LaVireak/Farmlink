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
            await this.transporter.sendMail({
                from: `"FarmLink" <${from}>`,
                to: email,
                subject: 'FarmLink verification code',
                text: `Your verification code is ${code}. It expires in 10 minutes.`,
                html: `<p>Your verification code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`,
            });
            this.logger.log(`Sent OTP email to ${email} via Gmail`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${email}`, error.stack);
            throw error;
        }
    }
}