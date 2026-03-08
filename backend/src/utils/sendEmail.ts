import { transporter } from '../config/email.ts';
import type { AuthEntityType } from './token.ts';
import 'dotenv/config';

const FROM = process.env.EMAIL_FROM ?? 'Voxela <noreply@voxela.com>';
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';

export async function sendVerificationEmail(
  to: string,
  token: string,
  entityType: AuthEntityType,
): Promise<void> {
  // Single unified frontend route: /auth/verify-email?token=...&type=user|company
  const verifyUrl = `${FRONTEND_URL}/auth/verify-email?token=${token}&type=${entityType}`;

  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Verify your Voxela account',
    html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <h2 style="color:#4f46e5;">Welcome to Voxela 👋</h2>
          <p>Thanks for signing up! Please verify your email address to activate your account.</p>
          <a href="${verifyUrl}"
             style="display:inline-block;margin:16px 0;padding:12px 24px;background:#4f46e5;
                    color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">
            Verify Email
          </a>
          <p style="color:#6b7280;font-size:13px;">
            This link expires in <strong>24 hours</strong>.<br/>
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>`,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  token: string,
  entityType: AuthEntityType,
): Promise<void> {
  // Single unified frontend route: /auth/reset-password?token=...&type=user|company
  const resetUrl = `${FRONTEND_URL}/auth/reset-password?token=${token}&type=${entityType}`;

  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Reset your Voxela password',
    html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <h2 style="color:#4f46e5;">Password Reset</h2>
          <p>You requested to reset your password. Click the button below to proceed.</p>
          <a href="${resetUrl}"
             style="display:inline-block;margin:16px 0;padding:12px 24px;background:#4f46e5;
                    color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">
            Reset Password
          </a>
          <p style="color:#6b7280;font-size:13px;">
            This link expires in <strong>1 hour</strong>.<br/>
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>`,
  });
}
