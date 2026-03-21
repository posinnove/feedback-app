import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { Company } from '../models/company.model.ts';
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  generatePasswordResetToken,
  verifyRefreshToken,
} from '../utils/token.ts';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '../utils/sendEmail.ts';

// Register

export async function registerCompany(data: {
  name: string;
  email: string;
  password: string;
}) {
  // Generate a slug from the company name
  const slug = data.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  const exists = await Company.findOne({
    where: { [Op.or]: [{ email: data.email }, { slug }] },
  });

  if (exists) {
    if (exists.email === data.email) {
      throw Object.assign(new Error('Email already in use'), { status: 409 });
    }
    throw Object.assign(new Error('Company name is already taken'), {
      status: 409,
    });
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const { token, expires } = generateVerificationToken();

  const company = await Company.create({
    name: data.name,
    slug,
    email: data.email,
    password: hashedPassword,
    location: null,
    website: null,
    description: null,
    logoUrl: null,
    isEmailVerified: false,
    emailVerificationToken: token,
    emailVerificationExpires: expires,
  });

  await sendVerificationEmail(company.email, token, 'company');

  return { id: company.id, email: company.email, slug: company.slug };
}

// Verify Email

export async function verifyCompanyEmail(token: string) {
  const company = await Company.findOne({
    where: {
      emailVerificationToken: token,
      emailVerificationExpires: { [Op.gt]: new Date() },
    },
  });

  if (!company) {
    throw Object.assign(new Error('Invalid or expired verification token'), {
      status: 400,
    });
  }

  await company.update({
    isEmailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpires: null,
  });

  return { message: 'Email verified successfully' };
}

// Resend Verification

export async function resendCompanyVerification(email: string) {
  const company = await Company.findOne({ where: { email } });

  if (company) {
    if (company.isEmailVerified) {
      throw Object.assign(new Error('Email is already verified'), {
        status: 400,
      });
    }
    const { token, expires } = generateVerificationToken();
    await company.update({
      emailVerificationToken: token,
      emailVerificationExpires: expires,
    });
    await sendVerificationEmail(company.email, token, 'company');
  }

  return { message: 'If the email exists, a verification link has been sent.' };
}

// Login

export async function loginCompany(email: string, password: string) {
  const company = await Company.findOne({ where: { email } });

  if (!company || !(await bcrypt.compare(password, company.password))) {
    throw Object.assign(new Error('Invalid email or password'), {
      status: 401,
    });
  }

  if (!company.isEmailVerified) {
    throw Object.assign(
      new Error('Please verify your email before logging in'),
      { status: 403 },
    );
  }

  const accessToken = generateAccessToken(company.id, 'company');
  const refreshToken = generateRefreshToken(company.id, 'company');

  return {
    accessToken,
    refreshToken,
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

// Forgot Password

export async function forgotCompanyPassword(email: string) {
  const company = await Company.findOne({ where: { email } });

  if (company) {
    const { token, expires } = generatePasswordResetToken();
    await company.update({
      passwordResetToken: token,
      passwordResetExpires: expires,
    });
    await sendPasswordResetEmail(company.email, token, 'company');
  }

  return {
    message: 'If the email exists, a password reset link has been sent.',
  };
}

// Reset Password

export async function resetCompanyPassword(token: string, newPassword: string) {
  const company = await Company.findOne({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { [Op.gt]: new Date() },
    },
  });

  if (!company) {
    throw Object.assign(new Error('Invalid or expired reset token'), {
      status: 400,
    });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await company.update({
    password: hashed,
    passwordResetToken: null,
    passwordResetExpires: null,
  });

  return { message: 'Password reset successfully' };
}

// Refresh Token

export async function refreshCompanyToken(token: string) {
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw Object.assign(new Error('Invalid or expired refresh token'), {
      status: 401,
    });
  }

  if (payload.type !== 'company') {
    throw Object.assign(new Error('Token type mismatch'), { status: 401 });
  }

  const company = await Company.findByPk(payload.id);
  if (!company) {
    throw Object.assign(new Error('Company not found'), { status: 404 });
  }

  const accessToken = generateAccessToken(company.id, 'company');
  const refreshToken = generateRefreshToken(company.id, 'company');

  return { accessToken, refreshToken };
}

// Get Me

export async function getCompanyProfile(id: number) {
  const company = await Company.findByPk(id, {
    attributes: [
      'id',
      'name',
      'slug',
      'email',
      'location',
      'website',
      'description',
      'logoUrl',
      'emailNotifications',
      'weeklyDigest',
      'publicProfile',
      'themeMode',
      'createdAt',
    ],
  });

  if (!company) {
    throw Object.assign(new Error('Company not found'), { status: 404 });
  }

  return company;
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

export async function updateCompanyProfile(
  id: number,
  data: {
    name: string;
    location?: string;
    website?: string;
    description?: string;
    logoUrl?: string;
  },
) {
  const company = await Company.findByPk(id);

  if (!company) {
    throw Object.assign(new Error('Company not found'), { status: 404 });
  }

  let slug = company.slug;
  if (data.name.trim() !== company.name) {
    slug = toSlug(data.name);
    const slugExists = await Company.findOne({
      where: {
        slug,
        id: { [Op.ne]: id },
      },
    });
    if (slugExists) {
      throw Object.assign(new Error('Company name is already taken'), {
        status: 409,
      });
    }
  }

  await company.update({
    name: data.name,
    slug,
    location: data.location?.trim() ? data.location : null,
    website: data.website?.trim() ? data.website.trim() : null,
    description: data.description?.trim() ? data.description.trim() : null,
    logoUrl: data.logoUrl?.trim() ? data.logoUrl.trim() : null,
  });

  return {
    id: company.id,
    name: company.name,
    slug: company.slug,
    email: company.email,
    location: company.location,
    website: company.website,
    description: company.description,
    logoUrl: company.logoUrl,
    emailNotifications: company.emailNotifications,
    weeklyDigest: company.weeklyDigest,
    publicProfile: company.publicProfile,
    themeMode: company.themeMode,
  };
}

export async function updateCompanySettings(
  id: number,
  data: {
    emailNotifications: boolean;
    weeklyDigest: boolean;
    publicProfile: boolean;
    themeMode: 'system' | 'light' | 'dark';
  },
) {
  const company = await Company.findByPk(id);

  if (!company) {
    throw Object.assign(new Error('Company not found'), { status: 404 });
  }

  await company.update({
    emailNotifications: data.emailNotifications,
    weeklyDigest: data.weeklyDigest,
    publicProfile: data.publicProfile,
    themeMode: data.themeMode,
  });

  return {
    id: company.id,
    name: company.name,
    slug: company.slug,
    email: company.email,
    location: company.location,
    logoUrl: company.logoUrl,
    emailNotifications: company.emailNotifications,
    weeklyDigest: company.weeklyDigest,
    publicProfile: company.publicProfile,
    themeMode: company.themeMode,
  };
}

export async function changeCompanyPassword(
  id: number,
  data: {
    currentPassword: string;
    newPassword: string;
  },
) {
  const company = await Company.findByPk(id);

  if (!company) {
    throw Object.assign(new Error('Company not found'), { status: 404 });
  }

  const validPassword = await bcrypt.compare(
    data.currentPassword,
    company.password,
  );
  if (!validPassword) {
    throw Object.assign(new Error('Current password is incorrect'), {
      status: 400,
    });
  }

  if (data.currentPassword === data.newPassword) {
    throw Object.assign(
      new Error('New password must be different from current password'),
      { status: 400 },
    );
  }

  const hashed = await bcrypt.hash(data.newPassword, 10);
  await company.update({ password: hashed });

  return { message: 'Password updated successfully' };
}
