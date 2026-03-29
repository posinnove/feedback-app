import { Users } from '../models/users.model.ts';
import { Company } from '../models/company.model.ts';
import { Feedback } from '../models/feedback.model.ts';
import { FeedbackReply } from '../models/feedback.reply.model.ts';
import { sendCompanyApprovalEmail } from '../utils/sendEmail.ts';
import { Op } from 'sequelize';

export async function getDashboardStats() {
  const [totalUsers, totalCompanies, totalFeedbacks, totalReplies] = await Promise.all([
    Users.count(),
    Company.count(),
    Feedback.count(),
    FeedbackReply.count(),
  ]);

  return { totalUsers, totalCompanies, totalFeedbacks, totalReplies };
}

export async function getAllCompaniesForAdmin(search?: string) {
  const whereClause = search ? {
    [Op.or]: [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } }
    ]
  } : {};

  return Company.findAll({
    where: whereClause,
    attributes: ['id', 'name', 'slug', 'email', 'isEmailVerified', 'isApproved', 'createdAt'],
    order: [['createdAt', 'DESC']],
  });
}

export async function toggleCompanyVerification(companyId: number, status: boolean) {
  const company = await Company.findByPk(companyId);
  if (!company) throw new Error('Company not found');
  
  const wasApproved = company.isApproved;
  company.isApproved = status;
  await company.save();

  if (!wasApproved && status) {
    // Notify company
    await sendCompanyApprovalEmail(company.email, company.name)
      .catch((err) => console.error('Failed to send approval email', err));
  }

  return company;
}

export async function deleteCompany(companyId: number) {
  const company = await Company.findByPk(companyId);
  if (!company) throw new Error('Company not found');
  await company.destroy();
}

export async function getAllFeedbacksForAdmin() {
  return Feedback.findAll({
    include: [{ model: Company, as: 'company', attributes: ['name', 'slug'] }],
    order: [['createdAt', 'DESC']],
  });
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
