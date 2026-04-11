import { Users } from '../models/users.model.ts';
import { Company } from '../models/company.model.ts';
import { Feedback } from '../models/feedback.model.ts';
import { FeedbackReply } from '../models/feedback.reply.model.ts';
import { CompanyFollower } from '../models/company.follower.model.ts';
import { sendCompanyApprovalEmail } from '../utils/sendEmail.ts';
import { Op, fn, col } from 'sequelize';
import { sequelize } from '../config/db.ts';
import bcrypt from 'bcryptjs';

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function generateUniqueCompanySlug(baseName: string, excludeId?: number) {
  const base = toSlug(baseName) || 'company';
  let slug = base;
  let suffix = 1;

  while (
    await Company.findOne({
      where: {
        slug,
        ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}),
      },
    })
  ) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function normalizeOptional(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function ensureCompanyEmailAvailable(
  email: string,
  excludeId?: number,
): Promise<void> {
  const existing = await Company.findOne({
    where: {
      email,
      ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}),
    },
  });

  if (existing) {
    throw new Error('Company email already in use');
  }
}

function isGeneratedAdminCompanyEmail(email: string): boolean {
  return email.endsWith('@company.local');
}

async function generateUniqueAdminCompanyEmail(
  baseName: string,
): Promise<string> {
  const baseSlug = toSlug(baseName) || 'company';
  let suffix = Date.now();

  while (true) {
    const candidate = `${baseSlug}-${suffix}@company.local`;
    const existing = await Company.findOne({ where: { email: candidate } });

    if (!existing) {
      return candidate;
    }

    suffix += 1;
  }
}

export async function getDashboardStats() {
  const [totalUsers, totalCompanies, totalFeedbacks, totalReplies] =
    await Promise.all([
      Users.count(),
      Company.count(),
      Feedback.count(),
      FeedbackReply.count(),
    ]);

  return { totalUsers, totalCompanies, totalFeedbacks, totalReplies };
}

export async function getAllCompaniesForAdmin(search?: string) {
  const whereClause = search
    ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  return Company.findAll({
    where: whereClause,
    attributes: [
      'id',
      'name',
      'slug',
      'email',
      'location',
      'website',
      'description',
      'logoUrl',
      'isEmailVerified',
      'isApproved',
      'createdAt',
      [fn('COUNT', col('followers.id')), 'subscriberCount'],
    ],
    include: [
      {
        model: CompanyFollower,
        as: 'followers',
        attributes: [],
        required: false,
      },
    ],
    group: ['Company.id'],
    raw: true,
    subQuery: false,
    order: [['createdAt', 'DESC']],
  });
}

export async function createCompanyByAdmin(data: {
  name: string;
  email?: string;
  location?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  isApproved?: boolean;
  isEmailVerified?: boolean;
}) {
  const name = data.name.trim();
  const inputEmail = data.email?.trim().toLowerCase();

  if (!name) throw new Error('Company name is required');

  const email = inputEmail || (await generateUniqueAdminCompanyEmail(name));

  await ensureCompanyEmailAvailable(email);
  const slug = await generateUniqueCompanySlug(name);

  const tempPassword = Math.random().toString(36).slice(-12);
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const company = await Company.create({
    name,
    slug,
    email,
    password: hashedPassword,
    location: normalizeOptional(data.location),
    website: normalizeOptional(data.website),
    description: normalizeOptional(data.description),
    logoUrl: normalizeOptional(data.logoUrl),
    isApproved: data.isApproved ?? true,
    isEmailVerified: data.isEmailVerified ?? true,
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
    isEmailVerified: company.isEmailVerified,
    isApproved: company.isApproved,
    createdAt: company.createdAt,
  };
}

export async function updateCompanyByAdmin(
  companyId: number,
  data: {
    name: string;
    email: string;
    location?: string;
    website?: string;
    description?: string;
    logoUrl?: string;
    isApproved?: boolean;
    isEmailVerified?: boolean;
  },
) {
  const company = await Company.findByPk(companyId);
  if (!company) throw new Error('Company not found');

  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();

  if (!name) throw new Error('Company name is required');
  if (!email) throw new Error('Company email is required');

  await ensureCompanyEmailAvailable(email, companyId);

  const slug =
    name === company.name
      ? company.slug
      : await generateUniqueCompanySlug(name, companyId);

  await company.update({
    name,
    slug,
    email,
    location: normalizeOptional(data.location),
    website: normalizeOptional(data.website),
    description: normalizeOptional(data.description),
    logoUrl: normalizeOptional(data.logoUrl),
    isApproved: data.isApproved ?? company.isApproved,
    isEmailVerified: data.isEmailVerified ?? company.isEmailVerified,
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
    isEmailVerified: company.isEmailVerified,
    isApproved: company.isApproved,
    createdAt: company.createdAt,
  };
}

export async function toggleCompanyVerification(
  companyId: number,
  status: boolean,
) {
  const company = await Company.findByPk(companyId);
  if (!company) throw new Error('Company not found');

  const wasApproved = company.isApproved;
  company.isApproved = status;
  await company.save();

  if (!wasApproved && status && !isGeneratedAdminCompanyEmail(company.email)) {
    // Notify company
    await sendCompanyApprovalEmail(
      company.email,
      company.name,
      company.slug,
    ).catch((err) => console.error('Failed to send approval email', err));
  }

  return company;
}

export async function deleteCompany(companyId: number) {
  const company = await Company.findByPk(companyId);
  if (!company) throw new Error('Company not found');
  await company.destroy();
}

export async function getAllFeedbacksForAdmin(
  page: number = 1,
  limit: number = 20,
) {
  const offset = (page - 1) * limit;
  const { count, rows } = await Feedback.findAndCountAll({
    include: [{ model: Company, as: 'company', attributes: ['name', 'slug'] }],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    feedbacks: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}

export async function deleteFeedback(feedbackId: number) {
  const feedback = await Feedback.findByPk(feedbackId);
  if (!feedback) throw new Error('Feedback not found');
  await feedback.destroy();
}

export async function deleteReply(replyId: number) {
  const reply = await FeedbackReply.findByPk(replyId);
  if (!reply) throw new Error('Reply not found');
  await reply.destroy();
}
