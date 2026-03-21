import {
  Notification,
  type NotificationType,
} from '../models/notification.model.ts';
import { Feedback } from '../models/feedback.model.ts';
import { FeedbackReply } from '../models/feedback.reply.model.ts';
import { Company } from '../models/company.model.ts';
import { Users } from '../models/users.model.ts';
import type { AuthEntityType } from '../utils/token.ts';

export async function getUnreadNotifications(
  recipientId: number,
  recipientType: AuthEntityType,
  limit: number = 20,
) {
  const notifications = await Notification.findAll({
    where: {
      recipientId,
      recipientType,
    },
    attributes: [
      'id',
      'type',
      'title',
      'message',
      'feedbackId',
      'relatedReplyId',
      'isRead',
      'createdAt',
    ],
    order: [['createdAt', 'DESC']],
    limit,
    include: [
      {
        model: Feedback,
        as: 'feedback',
        attributes: ['id', 'title', 'status'],
        required: true,
        include: [
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name', 'slug'],
            required: true,
          },
        ],
      },
    ],
  });

  return notifications.map((notif) => ({
    id: notif.id,
    type: notif.type,
    title: notif.title,
    message: notif.message,
    feedbackId: notif.feedbackId,
    relatedReplyId: notif.relatedReplyId,
    isRead: notif.isRead,
    createdAt: notif.createdAt,
    feedback: {
      id: notif.feedback?.id,
      title: notif.feedback?.title,
      status: notif.feedback?.status,
      company: {
        id: notif.feedback?.company?.id,
        name: notif.feedback?.company?.name,
        slug: notif.feedback?.company?.slug,
      },
    },
  }));
}

export async function markNotificationsAsRead(
  recipientId: number,
  recipientType: AuthEntityType,
  notificationIds?: number[],
) {
  const where: any = {
    recipientId,
    recipientType,
  };

  if (notificationIds && notificationIds.length > 0) {
    where.id = notificationIds;
  }

  await Notification.update({ isRead: true }, { where });
}

export async function createNotification(
  recipientId: number,
  recipientType: AuthEntityType,
  type: NotificationType,
  title: string,
  feedbackId: number,
  message?: string,
  relatedReplyId?: number | null,
) {
  await Notification.create({
    recipientId,
    recipientType,
    type,
    title,
    feedbackId,
    message,
    relatedReplyId: relatedReplyId || null,
    isRead: false,
  });
}

export async function getUnreadCount(
  recipientId: number,
  recipientType: AuthEntityType,
) {
  return Notification.count({
    where: {
      recipientId,
      recipientType,
      isRead: false,
    },
  });
}
