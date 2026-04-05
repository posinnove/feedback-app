import jwt from 'jsonwebtoken';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import * as userAuthService from './user.auth.service.ts';
import * as companyAuthService from './company.auth.service.ts';
import { Users } from '../models/users.model.ts';
import { Company } from '../models/company.model.ts';
import { Op } from 'sequelize';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/token.ts';
import { sendAdminNewCompanyCreatedEmail } from '../utils/sendEmail.ts';

interface GoogleTokenInfo {
  email: string;
  email_verified: 'true' | 'false';
  aud: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
}

async function verifyGoogleIdToken(idToken: string): Promise<GoogleTokenInfo> {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
  );

  if (!response.ok) {
    throw Object.assign(new Error('Invalid Google token'), { status: 401 });
  }

  const tokenInfo = (await response.json()) as GoogleTokenInfo;
  const expectedClientId = process.env.GOOGLE_CLIENT_ID;

  if (!expectedClientId) {
    throw Object.assign(new Error('GOOGLE_CLIENT_ID is not configured'), {
      status: 500,
    });
  }

  if (tokenInfo.aud !== expectedClientId) {
    throw Object.assign(new Error('Invalid Google token audience'), {
      status: 401,
    });
  }

  if (tokenInfo.email_verified !== 'true') {
    throw Object.assign(new Error('Google email is not verified'), {
      status: 401,
    });
  }

  return tokenInfo;
}

function splitName(
  givenName?: string,
  familyName?: string,
  fullName?: string,
): { firstName: string; lastName: string } {
  if (givenName || familyName) {
    return {
      firstName: (givenName ?? 'Google').trim() || 'Google',
      lastName: (familyName ?? 'User').trim() || 'User',
    };
  }

  const parts = (fullName ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: 'Google', lastName: 'User' };
  }
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: 'User' };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function generateUniqueCompanySlug(baseName: string): Promise<string> {
  const base = toSlug(baseName) || 'company';
  let slug = base;
  let suffix = 1;

  while (await Company.findOne({ where: { slug } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

// ─── Unified Login ────────────────────────────────────────────────────────────

export async function unifiedLogin(email: string, password: string) {
  // Try user first
  const user = await Users.findOne({ where: { email } });
  if (user) {
    const result = await userAuthService.loginUser(email, password);
    return { ...result, type: 'user' as const };
  }

  // Fallback: try company
  const company = await Company.findOne({ where: { email } });
  if (company) {
    const result = await companyAuthService.loginCompany(email, password);
    return { ...result, type: 'company' as const };
  }

  // Neither found — return generic error (don't reveal which table was checked)
  throw Object.assign(new Error('Invalid email or password'), { status: 401 });
}

// ─── Unified Google Login/Signup (User + Company) ───────────────────────────

export async function unifiedGoogleLogin(
  idToken: string,
  accountType?: 'user' | 'company',
) {
  const tokenInfo = await verifyGoogleIdToken(idToken);

  const existingUser = await Users.findOne({
    where: { email: tokenInfo.email },
  });
  const existingCompany = await Company.findOne({
    where: { email: tokenInfo.email },
  });

  if (!accountType) {
    if (existingUser && !existingCompany) {
      const accessToken = generateAccessToken(existingUser.id, 'user');
      const refreshToken = generateRefreshToken(existingUser.id, 'user');
      return {
        accessToken,
        refreshToken,
        type: 'user' as const,
        user: {
          id: existingUser.id,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
          avatarUrl: existingUser.avatarUrl,
          phoneNumber: existingUser.phoneNumber,
          themeMode: existingUser.themeMode,
          isAdmin: existingUser.isAdmin,
        },
      };
    }

    if (existingCompany && !existingUser) {
      const accessToken = generateAccessToken(existingCompany.id, 'company');
      const refreshToken = generateRefreshToken(existingCompany.id, 'company');
      return {
        accessToken,
        refreshToken,
        type: 'company' as const,
        company: {
          id: existingCompany.id,
          name: existingCompany.name,
          slug: existingCompany.slug,
          email: existingCompany.email,
          location: existingCompany.location,
          logoUrl: existingCompany.logoUrl,
          themeMode: existingCompany.themeMode,
        },
      };
    }

    if (existingUser && existingCompany) {
      throw Object.assign(
        new Error(
          'Multiple account types found for this email. Please choose account type.',
        ),
        { status: 409 },
      );
    }

    accountType = 'user';
  }

  if (accountType === 'user') {
    if (existingCompany && !existingUser) {
      throw Object.assign(
        new Error(
          'This email belongs to a company account. Choose Company sign up/login.',
        ),
        { status: 409 },
      );
    }

    let user = existingUser;
    if (!user) {
      const { firstName, lastName } = splitName(
        tokenInfo.given_name,
        tokenInfo.family_name,
        tokenInfo.name,
      );
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await Users.create({
        firstName,
        lastName,
        email: tokenInfo.email,
        password: hashedPassword,
        avatarUrl: tokenInfo.picture ?? null,
        phoneNumber: null,
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      });
    } else {
      const updateData: Partial<Users> = {};
      if (!user.isEmailVerified) {
        updateData.isEmailVerified = true;
        updateData.emailVerificationToken = null;
        updateData.emailVerificationExpires = null;
      }
      if (tokenInfo.picture && user.avatarUrl !== tokenInfo.picture) {
        updateData.avatarUrl = tokenInfo.picture;
      }
      if (Object.keys(updateData).length > 0) {
        await user.update(updateData);
      }
    }

    const accessToken = generateAccessToken(user.id, 'user');
    const refreshToken = generateRefreshToken(user.id, 'user');

    return {
      accessToken,
      refreshToken,
      type: 'user' as const,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        phoneNumber: user.phoneNumber,
        themeMode: user.themeMode,
        isAdmin: user.isAdmin,
      },
    };
  }

  if (existingUser && !existingCompany) {
    throw Object.assign(
      new Error(
        'This email belongs to a user account. Choose Personal sign up/login.',
      ),
      { status: 409 },
    );
  }

  let company = existingCompany;
  if (!company) {
    const companyName =
      tokenInfo.name?.trim() || tokenInfo.email.split('@')[0] || 'New Company';
    const slug = await generateUniqueCompanySlug(companyName);
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    company = await Company.create({
      name: companyName,
      slug,
      email: tokenInfo.email,
      password: hashedPassword,
      location: null,
      website: null,
      description: null,
      logoUrl: tokenInfo.picture ?? null,
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });

    // Notify Admins
    try {
      const admins = await Users.findAll({ where: { isAdmin: true }, attributes: ['email'] });
      if (admins.length > 0) {
        await sendAdminNewCompanyCreatedEmail(
          admins.map(a => a.email),
          company.name,
          company.email
        );
      }
    } catch (err) {
      console.error('Failed to send admin notification email', err);
    }
  } else {
    const updateData: Partial<Company> = {};
    if (!company.isEmailVerified) {
      updateData.isEmailVerified = true;
      updateData.emailVerificationToken = null;
      updateData.emailVerificationExpires = null;
    }
    if (tokenInfo.picture && company.logoUrl !== tokenInfo.picture) {
      updateData.logoUrl = tokenInfo.picture;
    }
    if (Object.keys(updateData).length > 0) {
      await company.update(updateData);
    }
  }

  const accessToken = generateAccessToken(company.id, 'company');
  const refreshToken = generateRefreshToken(company.id, 'company');

  return {
    accessToken,
    refreshToken,
    type: 'company' as const,
    company: {
      id: company.id,
      name: company.name,
      slug: company.slug,
      email: company.email,
      location: company.location,
      logoUrl: company.logoUrl,
      themeMode: company.themeMode,
    },
  };
}

// ─── Unified Forgot Password ──────────────────────────────────────────────────

export async function unifiedForgotPassword(email: string) {
  const user = await Users.findOne({ where: { email } });
  if (user) {
    return userAuthService.forgotUserPassword(email);
  }

  const company = await Company.findOne({ where: { email } });
  if (company) {
    return companyAuthService.forgotCompanyPassword(email);
  }

  // Return generic message regardless — don't reveal if email exists
  return {
    message: 'If the email exists, a password reset link has been sent.',
  };
}

// ─── Unified Reset Password ───────────────────────────────────────────────────

export async function unifiedResetPassword(token: string, newPassword: string) {
  // Try user reset token first
  const userWithToken = await Users.findOne({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { [Op.gt]: new Date() },
    },
  });
  if (userWithToken) {
    return userAuthService.resetUserPassword(token, newPassword);
  }

  // Try company reset token
  const companyWithToken = await Company.findOne({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { [Op.gt]: new Date() },
    },
  });
  if (companyWithToken) {
    return companyAuthService.resetCompanyPassword(token, newPassword);
  }

  throw Object.assign(new Error('Invalid or expired reset token'), {
    status: 400,
  });
}

// ─── Unified Verify Email ─────────────────────────────────────────────────────

export async function unifiedVerifyEmail(token: string) {
  // Try user verification token first
  const userWithToken = await Users.findOne({
    where: {
      emailVerificationToken: token,
      emailVerificationExpires: { [Op.gt]: new Date() },
    },
  });
  if (userWithToken) {
    return userAuthService.verifyUserEmail(token);
  }

  // Try company verification token
  const companyWithToken = await Company.findOne({
    where: {
      emailVerificationToken: token,
      emailVerificationExpires: { [Op.gt]: new Date() },
    },
  });
  if (companyWithToken) {
    return companyAuthService.verifyCompanyEmail(token);
  }

  throw Object.assign(new Error('Invalid or expired verification token'), {
    status: 400,
  });
}

// ─── Unified Resend Verification ──────────────────────────────────────────────

export async function unifiedResendVerification(email: string) {
  const user = await Users.findOne({ where: { email } });
  if (user) {
    return userAuthService.resendUserVerification(email);
  }

  const company = await Company.findOne({ where: { email } });
  if (company) {
    return companyAuthService.resendCompanyVerification(email);
  }

  return { message: 'If the email exists, a verification link has been sent.' };
}

// ─── Unified Refresh Token ────────────────────────────────────────────────────

export async function unifiedRefreshToken(token: string) {
  // Decode to get the type without full verification first
  const raw = jwt.decode(token) as { type?: string } | null;
  const type = raw?.type;

  if (type === 'user') {
    return userAuthService.refreshUserToken(token);
  }
  if (type === 'company') {
    return companyAuthService.refreshCompanyToken(token);
  }

  // Unknown type — let verifyRefreshToken throw
  try {
    verifyRefreshToken(token);
  } catch {
    throw Object.assign(new Error('Invalid or expired refresh token'), {
      status: 401,
    });
  }
  throw Object.assign(new Error('Token type mismatch'), { status: 401 });
}
