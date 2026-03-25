import { Company } from '../models/company.model.ts';
import { Feedback } from '../models/feedback.model.ts';
import { FeedbackType } from '../models/feedback.type.model.ts';
import { FeedbackVote } from '../models/feedback.vote.model.ts';
import { CompanyFollower } from '../models/company.follower.model.ts';
import { FeedbackReply } from '../models/feedback.reply.model.ts';
import { sequelize } from '../config/db.ts';
import type { AuthEntityType } from '../utils/token.ts';
import { literal } from 'sequelize';
import { createNotification } from './notification.service.ts';
import logger from '../utils/logger.ts';

export type VoteDirection = 'up' | 'down';

export async function getAllCompanies() {
  return Company.findAll({
    where: { isApproved: true },
    attributes: [
      'id',
      'name',
      'slug',
      'logoUrl',
      'description',
      [
        literal(
          '(SELECT COUNT(*) FROM company_followers cf WHERE cf.company_id = "Company"."id")',
        ),
        'followerCount',
      ],
    ],
    order: [['name', 'ASC']],
  });
}

export async function findCompanyBySlug(
  slug: string,
  viewer?: { id: number; type: AuthEntityType },
) {
  const company = await Company.findOne({
    where: { slug },
    attributes: {
      include: [
        [
          literal(
            '(SELECT COUNT(*) FROM company_followers cf WHERE cf.company_id = "Company"."id")',
          ),
          'followerCount',
        ],
      ],
    },
    include: [
      {
        model: Feedback,
        as: 'feedbacks',
        attributes: [
          'id',
          'title',
          'description',
          'status',
          'upvotes',
          'downvotes',
          'createdAt',
        ],
        include: [
          {
            model: FeedbackType,
            as: 'feedbackType',
            attributes: ['id', 'name', 'slug'],
          },
        ],
      },
    ],
  });

  if (!company) {
    return null;
  }

  if (!company.isApproved) {
    if (viewer?.type === 'user') {
      const { Users } = await import('../models/users.model.ts');
      const user = await Users.findByPk(viewer.id, { attributes: ['isAdmin'] });
      if (!user?.isAdmin) {
        return null;
      }
    } else {
      return null;
    }
  }

  if (!viewer || !company.feedbacks?.length) {
    return company;
  }

  const feedbackIds = company.feedbacks.map((feedback) => feedback.id);
  const votes = await FeedbackVote.findAll({
    where: {
      feedbackId: feedbackIds,
      voterId: viewer.id,
      voterType: viewer.type,
    },
    attributes: ['feedbackId', 'direction'],
  });

  const voteMap = new Map<number, VoteDirection>(
    votes.map((vote) => [vote.feedbackId, vote.direction as VoteDirection]),
  );

  const companyJson = company.toJSON() as {
    feedbacks?: Array<{ id: number; userVote?: VoteDirection | null }>;
    [key: string]: unknown;
  };

  companyJson.feedbacks = (companyJson.feedbacks ?? []).map((feedback) => ({
    ...feedback,
    userVote: voteMap.get(feedback.id) ?? null,
  }));

  return companyJson;
}

export async function getFollowedCompanies(
  followerId: number,
  followerType: AuthEntityType,
) {
  return Company.findAll({
    where: { isApproved: true },
    attributes: [
      'id',
      'name',
      'slug',
      'logoUrl',
      'description',
      [
        literal(
          '(SELECT COUNT(*) FROM company_followers cf WHERE cf.company_id = "Company"."id")',
        ),
        'followerCount',
      ],
    ],
    include: [
      {
        model: CompanyFollower,
        as: 'followers',
        attributes: [],
        where: {
          followerId,
          followerType,
        },
        required: true,
      },
    ],
    order: [['name', 'ASC']],
  });
}

export async function followCompany(
  companyId: number,
  followerId: number,
  followerType: AuthEntityType,
) {
  const [follow] = await CompanyFollower.findOrCreate({
    where: {
      companyId,
      followerId,
      followerType,
    },
    defaults: {
      companyId,
      followerId,
      followerType,
    },
  });

  const followerCount = await CompanyFollower.count({ where: { companyId } });
  return {
    followed: true,
    created: Boolean(follow),
    followerCount,
  };
}

export async function unfollowCompany(
  companyId: number,
  followerId: number,
  followerType: AuthEntityType,
) {
  await CompanyFollower.destroy({
    where: {
      companyId,
      followerId,
      followerType,
    },
  });

  const followerCount = await CompanyFollower.count({ where: { companyId } });
  return {
    followed: false,
    followerCount,
  };
}

export async function voteOnFeedback(
  companyId: number,
  feedbackId: number,
  direction: VoteDirection,
  voterId?: number,
  voterType?: AuthEntityType,
) {
  return sequelize.transaction(async (transaction) => {
    const feedback = await Feedback.findOne({
      where: {
        id: feedbackId,
        companyId,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!feedback) return null;

    if (!voterId || !voterType) {
      await feedback.increment(direction === 'up' ? 'upvotes' : 'downvotes', {
        by: 1,
        transaction,
      });

      await feedback.reload({ transaction });
      return {
        feedback,
        action: 'added' as const,
        userVote: direction,
      };
    }

    const existingVote = await FeedbackVote.findOne({
      where: {
        feedbackId,
        voterId,
        voterType,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    let action: 'added' | 'removed' | 'switched' = 'added';
    let userVote: VoteDirection | null = direction;

    if (!existingVote) {
      await FeedbackVote.create(
        {
          feedbackId,
          voterId,
          voterType,
          direction,
        },
        { transaction },
      );
      await feedback.increment(direction === 'up' ? 'upvotes' : 'downvotes', {
        by: 1,
        transaction,
      });
    } else if (existingVote.direction === direction) {
      action = 'removed';
      userVote = null;
      await existingVote.destroy({ transaction });
      await feedback.decrement(direction === 'up' ? 'upvotes' : 'downvotes', {
        by: 1,
        transaction,
      });
    } else {
      action = 'switched';
      await existingVote.update({ direction }, { transaction });
      await feedback.decrement(
        existingVote.direction === 'up' ? 'upvotes' : 'downvotes',
        {
          by: 1,
          transaction,
        },
      );
      await feedback.increment(direction === 'up' ? 'upvotes' : 'downvotes', {
        by: 1,
        transaction,
      });
    }

    await feedback.reload({ transaction });
    return {
      feedback,
      action,
      userVote,
    };
  });
}

export async function createFeedbackRequest(
  companyId: number,
  data: {
    title: string;
    description?: string;
    feedbackTypeId: number;
    requesterUserId: number | null;
    isAnonymous: boolean;
  },
) {
  const feedbackType = await FeedbackType.findByPk(data.feedbackTypeId, {
    attributes: ['id', 'name', 'slug'],
  });

  if (!feedbackType) {
    throw new Error('Invalid feedback type');
  }

  const feedback = await Feedback.create({
    companyId,
    feedbackTypeId: data.feedbackTypeId,
    requesterUserId: data.requesterUserId,
    isAnonymous: data.isAnonymous,
    title: data.title.trim(),
    description: data.description?.trim() ? data.description.trim() : null,
    status: 'planned',
  });

  // Create notification for the company
  await createNotification(
    companyId,
    'company',
    'feedback_created',
    `New feedback: "${feedback.title}"`,
    feedback.id,
    `A new feedback request has been submitted to your company.`,
  );

  return {
    id: feedback.id,
    feedbackType: {
      id: feedbackType.id,
      name: feedbackType.name,
      slug: feedbackType.slug,
    },
    visibility: data.isAnonymous ? 'anonymous' : 'public',
    title: feedback.title,
    description: feedback.description,
    status: feedback.status,
    upvotes: feedback.upvotes,
    downvotes: feedback.downvotes,
    createdAt: feedback.createdAt,
  };
}

export async function updateFeedbackStatus(
  feedbackId: number,
  companyId: number,
  newStatus: string,
) {
  const feedback = await Feedback.findOne({
    where: {
      id: feedbackId,
      companyId,
    },
    include: [
      {
        model: FeedbackReply,
        as: 'replies',
        attributes: ['authorId', 'authorType'],
      },
    ],
  });

  if (!feedback) {
    throw new Error('Feedback not found or does not belong to this company');
  }

  const oldStatus = feedback.status;
  feedback.status = newStatus as any;
  await feedback.save();

  // Do notification fan-out in background so drag/drop response returns immediately.
  void queueFeedbackStatusNotifications(
    feedback,
    feedbackId,
    oldStatus,
    newStatus,
  );

  return {
    id: feedback.id,
    status: feedback.status,
  };
}

async function queueFeedbackStatusNotifications(
  feedback: Feedback,
  feedbackId: number,
  oldStatus: string,
  newStatus: string,
) {
  try {
    // Send notifications to relevant people
    const usersToNotify = new Set<number>();

    // Add requester if they exist
    if (feedback.requesterUserId) {
      usersToNotify.add(feedback.requesterUserId);
    }

    // Add all users who replied
    const replies = feedback.get('replies') as any[] | undefined;
    if (replies && replies.length > 0) {
      replies.forEach((reply) => {
        if (reply.authorType === 'user') {
          usersToNotify.add(reply.authorId);
        }
      });
    }

    await Promise.all(
      [...usersToNotify].map((userId) =>
        createNotification(
          userId,
          'user',
          'feedback_status_changed',
          `Feedback status changed from "${oldStatus}" to "${newStatus}"`,
          feedbackId,
          `The status of feedback "${feedback.title}" has been updated to ${newStatus}.`,
        ),
      ),
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Failed to create feedback status notifications', {
      feedbackId,
      message,
    });
  }
}
