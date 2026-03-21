import { literal } from 'sequelize';
import { Company } from '../models/company.model.ts';
import { Feedback } from '../models/feedback.model.ts';
import type { Order } from 'sequelize';
import { FeedbackType } from '../models/feedback.type.model.ts';
import { FeedbackReply } from '../models/feedback.reply.model.ts';
import { Users } from '../models/users.model.ts';
import type { AuthEntityType } from '../utils/token.ts';
import { sequelize } from '../config/db.ts';
import {
  FeedbackReplyVote,
  type ReplyVoteDirection,
} from '../models/feedback.reply.vote.model.ts';
import { FeedbackVote } from '../models/feedback.vote.model.ts';
import { createNotification } from './notification.service.ts';

export type PublicFeedbackSort = 'trending' | 'new' | 'top' | 'all';

export async function getPublicFeedbackFeed(
  sort: PublicFeedbackSort,
  viewer?: { id: number; type: AuthEntityType },
) {
  const order: Order =
    sort === 'top'
      ? [
          ['upvotes', 'DESC'],
          ['createdAt', 'DESC'],
        ]
      : sort === 'new' || sort === 'all'
        ? [['createdAt', 'DESC']]
        : [
            [
              literal('("Feedback"."upvotes" - "Feedback"."downvotes")'),
              'DESC',
            ],
            ['createdAt', 'DESC'],
          ];

  const feedbacks = await Feedback.findAll({
    attributes: [
      'id',
      'title',
      'description',
      'status',
      'upvotes',
      'downvotes',
      'viewCount',
      'isAnonymous',
      'requesterUserId',
      'createdAt',
      'updatedAt',
      [
        literal(
          '(SELECT COUNT(*) FROM feedback_replies fr WHERE fr.feedback_id = "Feedback"."id")',
        ),
        'replyCount',
      ],
    ],
    include: [
      {
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'slug', 'logoUrl'],
      },
      {
        model: FeedbackType,
        as: 'feedbackType',
        attributes: ['id', 'name', 'slug'],
      },
      {
        model: Users,
        as: 'requester',
        attributes: ['id', 'firstName', 'lastName'],
      },
    ],
    order,
    limit: 100,
  });

  let voteMap = new Map<number, 'up' | 'down'>();
  if (viewer && feedbacks.length > 0) {
    const feedbackIds = feedbacks.map((feedback) => feedback.id);
    const votes = await FeedbackVote.findAll({
      where: {
        feedbackId: feedbackIds,
        voterId: viewer.id,
        voterType: viewer.type,
      },
      attributes: ['feedbackId', 'direction'],
    });
    voteMap = new Map(
      votes.map((vote) => [vote.feedbackId, vote.direction as 'up' | 'down']),
    );
  }

  return feedbacks.map((feedback) => ({
    id: feedback.id,
    title: feedback.title,
    description: feedback.description,
    status: feedback.status,
    upvotes: feedback.upvotes,
    downvotes: feedback.downvotes,
    viewCount: feedback.viewCount,
    replyCount: Number(feedback.get('replyCount') ?? 0),
    createdAt: feedback.createdAt,
    updatedAt: feedback.updatedAt,
    canEdit:
      viewer?.type === 'user' &&
      typeof feedback.requesterUserId === 'number' &&
      viewer.id === feedback.requesterUserId,
    company: {
      id: feedback.company?.id,
      name: feedback.company?.name,
      slug: feedback.company?.slug,
      logoUrl: feedback.company?.logoUrl,
    },
    feedbackType: feedback.feedbackType
      ? {
          id: feedback.feedbackType.id,
          name: feedback.feedbackType.name,
          slug: feedback.feedbackType.slug,
        }
      : null,
    requester: feedback.isAnonymous
      ? null
      : feedback.requester
        ? {
            id: feedback.requester.id,
            name:
              `${feedback.requester.firstName} ${feedback.requester.lastName}`.trim() ||
              'User',
          }
        : null,
    visibility: feedback.isAnonymous ? 'anonymous' : 'public',
    userVote: voteMap.get(feedback.id) ?? null,
  }));
}

export async function getPublicFeedbackById(
  feedbackId: number,
  viewer?: { id: number; type: AuthEntityType },
) {
  const feedback = await Feedback.findByPk(feedbackId, {
    attributes: [
      'id',
      'title',
      'description',
      'status',
      'upvotes',
      'downvotes',
      'viewCount',
      'isAnonymous',
      'requesterUserId',
      'createdAt',
      'updatedAt',
      [
        literal(
          '(SELECT COUNT(*) FROM feedback_replies fr WHERE fr.feedback_id = "Feedback"."id")',
        ),
        'replyCount',
      ],
    ],
    include: [
      {
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'slug', 'logoUrl'],
      },
      {
        model: FeedbackType,
        as: 'feedbackType',
        attributes: ['id', 'name', 'slug'],
      },
      {
        model: Users,
        as: 'requester',
        attributes: ['id', 'firstName', 'lastName'],
      },
    ],
  });

  if (!feedback) return null;

  await feedback.increment('viewCount', { by: 1 });
  await feedback.reload();

  let userVote: 'up' | 'down' | null = null;
  if (viewer) {
    const vote = await FeedbackVote.findOne({
      where: {
        feedbackId,
        voterId: viewer.id,
        voterType: viewer.type,
      },
      attributes: ['direction'],
    });
    userVote = (vote?.direction as 'up' | 'down' | undefined) ?? null;
  }

  return {
    id: feedback.id,
    title: feedback.title,
    description: feedback.description,
    status: feedback.status,
    upvotes: feedback.upvotes,
    downvotes: feedback.downvotes,
    viewCount: feedback.viewCount,
    replyCount: Number(feedback.get('replyCount') ?? 0),
    createdAt: feedback.createdAt,
    updatedAt: feedback.updatedAt,
    canEdit:
      viewer?.type === 'user' &&
      typeof feedback.requesterUserId === 'number' &&
      viewer.id === feedback.requesterUserId,
    company: {
      id: feedback.company?.id,
      name: feedback.company?.name,
      slug: feedback.company?.slug,
      logoUrl: feedback.company?.logoUrl,
    },
    feedbackType: feedback.feedbackType
      ? {
          id: feedback.feedbackType.id,
          name: feedback.feedbackType.name,
          slug: feedback.feedbackType.slug,
        }
      : null,
    requester: feedback.isAnonymous
      ? null
      : feedback.requester
        ? {
            id: feedback.requester.id,
            name:
              `${feedback.requester.firstName} ${feedback.requester.lastName}`.trim() ||
              'User',
          }
        : null,
    visibility: feedback.isAnonymous ? 'anonymous' : 'public',
    userVote,
  };
}

export async function getAllFeedbackTypes() {
  const feedbackTypes = await FeedbackType.findAll({
    attributes: ['id', 'name', 'slug'],
    order: [['name', 'ASC']],
  });

  return feedbackTypes.map((feedbackType) => ({
    id: feedbackType.id,
    name: feedbackType.name,
    slug: feedbackType.slug,
  }));
}

export async function getFeedbackReplies(
  feedbackId: number,
  viewer?: { id: number; type: AuthEntityType },
) {
  const replies = await FeedbackReply.findAll({
    where: { feedbackId },
    attributes: [
      'id',
      'parentReplyId',
      'authorId',
      'authorType',
      'isAnonymous',
      'content',
      'createdAt',
      'updatedAt',
      'upvotes',
      'downvotes',
    ],
    order: [['createdAt', 'ASC']],
  });

  const userIds = replies
    .filter((r) => r.authorType === 'user')
    .map((r) => r.authorId);
  const companyIds = replies
    .filter((r) => r.authorType === 'company')
    .map((r) => r.authorId);

  const [users, companies] = await Promise.all([
    userIds.length
      ? Users.findAll({
          where: { id: userIds },
          attributes: ['id', 'firstName', 'lastName', 'avatarUrl'],
        })
      : Promise.resolve([]),
    companyIds.length
      ? Company.findAll({
          where: { id: companyIds },
          attributes: ['id', 'name', 'logoUrl'],
        })
      : Promise.resolve([]),
  ]);

  const userMap = new Map(
    users.map((user) => [
      user.id,
      {
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'User',
        avatarUrl: user.avatarUrl ?? null,
      },
    ]),
  );
  const companyMap = new Map(
    companies.map((company) => [
      company.id,
      {
        name: company.name,
        logoUrl: company.logoUrl ?? null,
      },
    ]),
  );

  let voteMap = new Map<number, 'up' | 'down'>();
  if (viewer && replies.length > 0) {
    const replyIds = replies.map((reply) => reply.id);
    const votes = await FeedbackReplyVote.findAll({
      where: {
        replyId: replyIds,
        voterId: viewer.id,
        voterType: viewer.type,
      },
      attributes: ['replyId', 'direction'],
    });
    voteMap = new Map(
      votes.map((vote) => [vote.replyId, vote.direction as 'up' | 'down']),
    );
  }

  return replies.map((reply) => ({
    id: reply.id,
    parentReplyId: reply.parentReplyId,
    content: reply.content,
    upvotes: reply.upvotes,
    downvotes: reply.downvotes,
    createdAt: reply.createdAt,
    updatedAt: reply.updatedAt,
    canEdit:
      !!viewer &&
      viewer.id === reply.authorId &&
      viewer.type === reply.authorType,
    visibility: reply.isAnonymous ? 'anonymous' : 'public',
    author: reply.isAnonymous
      ? null
      : {
          id: reply.authorId,
          type: reply.authorType,
          name:
            reply.authorType === 'user'
              ? (userMap.get(reply.authorId)?.name ?? 'User')
              : (companyMap.get(reply.authorId)?.name ?? 'Company'),
          avatarUrl:
            reply.authorType === 'user'
              ? (userMap.get(reply.authorId)?.avatarUrl ?? null)
              : (companyMap.get(reply.authorId)?.logoUrl ?? null),
        },
    userVote: voteMap.get(reply.id) ?? null,
  }));
}

export async function createFeedbackReply(
  feedbackId: number,
  authorId: number,
  authorType: AuthEntityType,
  content: string,
  isAnonymous: boolean,
  parentReplyId?: number,
) {
  const feedback = await Feedback.findByPk(feedbackId, {
    attributes: ['id', 'companyId', 'requesterUserId', 'title'],
  });
  if (!feedback) return null;

  if (parentReplyId) {
    const parentReply = await FeedbackReply.findOne({
      where: {
        id: parentReplyId,
        feedbackId,
      },
      attributes: ['id', 'authorId', 'authorType'],
    });

    if (!parentReply) {
      throw new Error('Invalid parent reply');
    }
  }

  const reply = await FeedbackReply.create({
    feedbackId,
    parentReplyId: parentReplyId ?? null,
    authorId,
    authorType,
    isAnonymous,
    content: content.trim(),
  });

  let authorName = 'Unknown';
  if (authorType === 'company') {
    const company = await Company.findByPk(authorId, { attributes: ['name'] });
    authorName = company?.name || 'Company';
  } else {
    const user = await Users.findByPk(authorId, {
      attributes: ['firstName', 'lastName'],
    });
    authorName = user
      ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
      : 'User';
  }

  // Notify company
  await createNotification(
    feedback.companyId,
    'company',
    'reply_created',
    `New reply on "${feedback.title}"`,
    feedbackId,
    `${authorName} replied to a feedback request.`,
    reply.id,
  );

  // Notify feedback requester (if not anonymous)
  if (feedback.requesterUserId && !isAnonymous) {
    await createNotification(
      feedback.requesterUserId,
      'user',
      'reply_created',
      `New reply on "${feedback.title}"`,
      feedbackId,
      `${authorName} replied to your feedback request.`,
      reply.id,
    );
  }

  // Notify parent reply author (reply to a reply)
  if (parentReplyId) {
    const parentReply = await FeedbackReply.findByPk(parentReplyId, {
      attributes: ['authorId', 'authorType'],
    });
    if (parentReply && !isAnonymous) {
      await createNotification(
        parentReply.authorId,
        parentReply.authorType,
        'reply_to_your_reply',
        `Reply to your comment on "${feedback.title}"`,
        feedbackId,
        `${authorName} replied to your comment.`,
        reply.id,
      );
    }
  }

  return {
    id: reply.id,
    parentReplyId: reply.parentReplyId,
    content: reply.content,
    upvotes: reply.upvotes,
    downvotes: reply.downvotes,
    visibility: reply.isAnonymous ? 'anonymous' : 'public',
    createdAt: reply.createdAt,
    updatedAt: reply.updatedAt,
    canEdit: true,
  };
}

export async function updateFeedbackRequest(
  feedbackId: number,
  actor: { id: number; type: AuthEntityType },
  payload: { title: string; description?: string },
) {
  if (actor.type !== 'user') {
    return { kind: 'forbidden' as const };
  }

  const feedback = await Feedback.findByPk(feedbackId, {
    attributes: ['id', 'requesterUserId', 'title', 'description', 'updatedAt'],
  });

  if (!feedback) {
    return { kind: 'not_found' as const };
  }

  if (feedback.requesterUserId !== actor.id) {
    return { kind: 'forbidden' as const };
  }

  feedback.title = payload.title.trim();
  feedback.description = payload.description?.trim()
    ? payload.description.trim()
    : null;
  await feedback.save();

  return {
    kind: 'ok' as const,
    feedback: {
      id: feedback.id,
      title: feedback.title,
      description: feedback.description,
      updatedAt: feedback.updatedAt,
    },
  };
}

export async function updateFeedbackReply(
  feedbackId: number,
  replyId: number,
  actor: { id: number; type: AuthEntityType },
  content: string,
) {
  const reply = await FeedbackReply.findOne({
    where: {
      id: replyId,
      feedbackId,
    },
    attributes: [
      'id',
      'feedbackId',
      'parentReplyId',
      'authorId',
      'authorType',
      'content',
      'updatedAt',
    ],
  });

  if (!reply) {
    return { kind: 'not_found' as const };
  }

  if (reply.authorId !== actor.id || reply.authorType !== actor.type) {
    return { kind: 'forbidden' as const };
  }

  reply.content = content.trim();
  await reply.save();

  return {
    kind: 'ok' as const,
    reply: {
      id: reply.id,
      parentReplyId: reply.parentReplyId,
      content: reply.content,
      updatedAt: reply.updatedAt,
    },
  };
}

export async function voteOnReply(
  feedbackId: number,
  replyId: number,
  direction: ReplyVoteDirection,
  voterId: number,
  voterType: AuthEntityType,
) {
  return sequelize.transaction(async (transaction) => {
    const reply = await FeedbackReply.findOne({
      where: {
        id: replyId,
        feedbackId,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!reply) return null;

    const existingVote = await FeedbackReplyVote.findOne({
      where: {
        replyId,
        voterId,
        voterType,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    let action: 'added' | 'removed' | 'switched' = 'added';
    let userVote: ReplyVoteDirection | null = direction;

    if (!existingVote) {
      await FeedbackReplyVote.create(
        {
          replyId,
          voterId,
          voterType,
          direction,
        },
        { transaction },
      );
      await reply.increment(direction === 'up' ? 'upvotes' : 'downvotes', {
        by: 1,
        transaction,
      });
    } else if (existingVote.direction === direction) {
      action = 'removed';
      userVote = null;
      await existingVote.destroy({ transaction });
      await reply.decrement(direction === 'up' ? 'upvotes' : 'downvotes', {
        by: 1,
        transaction,
      });
    } else {
      action = 'switched';
      await existingVote.update({ direction }, { transaction });
      await reply.decrement(
        existingVote.direction === 'up' ? 'upvotes' : 'downvotes',
        {
          by: 1,
          transaction,
        },
      );
      await reply.increment(direction === 'up' ? 'upvotes' : 'downvotes', {
        by: 1,
        transaction,
      });
    }

    await reply.reload({ transaction });
    return {
      reply,
      action,
      userVote,
    };
  });
}
