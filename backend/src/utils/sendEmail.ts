import { transporter } from '../config/email.ts';
import type { AuthEntityType } from './token.ts';
import 'dotenv/config';

const FROM = process.env.EMAIL_FROM ?? 'Voxella <noreply@voxella.app>';
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';

// Shared minimalist monochrome base CSS
const baseStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
  body { font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 40px 20px; -webkit-font-smoothing: antialiased; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; }
  .header { padding: 32px 32px 24px 32px; border-bottom: 1px solid #e5e5e5; }
  .brand { font-size: 24px; font-weight: 800; color: #000000; letter-spacing: -0.5px; margin: 0; }
  .content { padding: 32px; }
  .content h1 { color: #000000; font-size: 22px; font-weight: 700; margin: 0 0 16px 0; }
  .content p { color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; }
  .btn { display: inline-block; background-color: #000000; color: #ffffff !important; font-weight: 600; font-size: 15px; text-decoration: none; padding: 12px 28px; border-radius: 6px; text-align: center; transition: background-color 0.2s; -webkit-tap-highlight-color: transparent; }
  .btn:hover { background-color: #333333; color: #ffffff !important; }
  .btn:visited { color: #ffffff !important; background-color: #000000; }
  .btn:active { color: #ffffff !important; background-color: #000000; }
  .btn:focus { color: #ffffff !important; background-color: #000000; outline: 2px solid #000000; outline-offset: 2px; }
  .footer { background-color: #fafafa; border-top: 1px solid #e5e5e5; padding: 24px 32px; text-align: center; }
  .footer p { color: #666666; font-size: 13px; margin: 0; }
  .meta-text { font-size: 14px; color: #666666; }
`;

export async function sendVerificationEmail(
  to: string,
  token: string,
  entityType: AuthEntityType,
): Promise<void> {
  const verifyUrl = `${FRONTEND_URL}/auth/verify-email?token=${token}&type=${entityType}`;
  const isCompany = entityType === 'company';

  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Verify your Voxella account',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>${baseStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <p class="brand">Voxella</p>
            </div>
            <div class="content">
              <h1>Welcome to Voxella.</h1>
              <p>Thanks for signing up. Please verify your email address to activate your <strong>${isCompany ? 'company' : 'user'}</strong> account and start exploring.</p>
              
              <div style="margin: 32px 0;">
                <a href="${verifyUrl}" class="btn">Verify Email Address</a>
              </div>
              
              <p class="meta-text">
                This link will expire in <strong>24 hours</strong>. If you didn't create an account with Voxella, you can safely ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Voxella. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  token: string,
  entityType: AuthEntityType,
): Promise<void> {
  const resetUrl = `${FRONTEND_URL}/auth/reset-password?token=${token}&type=${entityType}`;

  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Reset your Voxella password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            ${baseStyles}
            .warning-box { border: 1px solid #000000; border-radius: 6px; padding: 16px; margin: 24px 0; background-color: #fafafa; }
            .warning-box p { color: #000000; font-size: 14px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <p class="brand">Voxella</p>
            </div>
            <div class="content">
              <h1>Reset your password</h1>
              <p>We received a request to reset the password for your Voxella account. Click the button below to securely set a new password.</p>
              
              <div style="margin: 32px 0;">
                <a href="${resetUrl}" class="btn">Reset Password</a>
              </div>
              
              <div class="warning-box">
                <p><strong>Security Notice:</strong> This link expires in 1 hour. Never share this link with anyone. If you didn't request a password reset, you can safely ignore this email.</p>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Voxella. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

export async function sendCompanyApprovalEmail(
  to: string,
  companyName: string,
  companySlug: string,
): Promise<void> {
  const kanbanUrl = `${FRONTEND_URL}/portal-kanban`;
  const publicBoardUrl = `${FRONTEND_URL}/${companySlug}`;

  await transporter.sendMail({
    from: FROM,
    to,
    subject: `${companyName} is now live on Voxella.`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            ${baseStyles}
            .badge { display: inline-block; border: 1px solid #000000; color: #000000; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 16px; letter-spacing: 0.5px; text-transform: uppercase; }
            .feature-list { background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 6px; padding: 20px; margin: 24px 0; }
            .feature-list h3 { margin: 0 0 12px 0; font-size: 14px; color: #000000; text-transform: uppercase; letter-spacing: 0.5px; }
            .feature-list ul { margin: 0; padding-left: 20px; color: #333333; font-size: 15px; }
            .feature-list li { margin-bottom: 8px; }
            .feature-list li:last-child { margin-bottom: 0; }
            .inline-code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; background: #f5f5f5; border: 1px solid #e5e5e5; border-radius: 4px; padding: 2px 6px; font-size: 13px; color: #111111; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <p class="brand">Voxella</p>
            </div>
            <div class="content">
              <h1>Welcome to the community.</h1>
              <p>Great news. <strong>${companyName}</strong> has been successfully reviewed and is now officially live on Voxella.</p>
              <p>Users can now discover your company profile, submit feedback, and help you build better products.</p>
              
              <div class="feature-list">
                <h3>What you can do next:</h3>
                <ul>
                  <li>Customize your public company profile</li>
                  <li>Review and respond to incoming user feedback</li>
                  <li>Track feature requests and engage with your community</li>
                </ul>
              </div>

              <p class="meta-text" style="margin-top: 0; margin-bottom: 20px;">
                Your public company board is now available at <span class="inline-code">/${companySlug}</span><br/>
                Link: <a href="${publicBoardUrl}" style="color:#111111;">${companyName}</a>
              </p>

              <div style="margin: 32px 0;">
                <a href="${kanbanUrl}" class="btn">Open Company Kanban</a>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Voxella. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

export async function sendAdminNewCompanyCreatedEmail(
  adminEmails: string[],
  companyName: string,
  companyEmail: string,
): Promise<void> {
  const adminUrl = `${FRONTEND_URL}/admin/companies`;

  await transporter.sendMail({
    from: FROM,
    to: adminEmails.join(','),
    subject: `Action Required: New Company Registration (${companyName})`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            ${baseStyles}
            .admin-badge { display: inline-block; background-color: #000000; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
            .data-table { width: 100%; border-collapse: collapse; margin: 24px 0; border: 1px solid #e5e5e5; border-radius: 6px; }
            .data-table td { padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 15px; }
            .data-table tr:last-child td { border-bottom: none; }
            .data-label { color: #666666; width: 100px; font-weight: 500; }
            .data-value { color: #000000; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <p class="brand">Voxella Admin</p>
            </div>
            <div class="content">
              <span class="admin-badge">System Alert</span>
              <h1>New Company Registration</h1>
              <p>A new company has registered on the platform and is currently awaiting admin review and approval.</p>
              
              <table class="data-table">
                <tr>
                  <td class="data-label">Company</td>
                  <td class="data-value">${companyName}</td>
                </tr>
                <tr>
                  <td class="data-label">Email</td>
                  <td class="data-value">${companyEmail}</td>
                </tr>
                <tr>
                  <td class="data-label">Status</td>
                  <td class="data-value">Pending Review</td>
                </tr>
              </table>
              
              <div style="margin: 32px 0;">
                <a href="${adminUrl}" class="btn">Review in Admin Panel</a>
              </div>
              
              <p class="meta-text">
                This is an automated system notification. Please process this request within 24 hours.
              </p>
            </div>
            <div class="footer">
              <p>Voxella Internal Communications</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}
