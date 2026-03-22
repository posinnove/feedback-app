import { Request, Response } from 'express';
import {
  createFeedbackReply,
  getPublicFeedbackFeed,
  getFeedbackReplies,
  getPublicFeedbackById,
  type PublicFeedbackSort,
  getAllFeedbackTypes,
  voteOnReply,
  updateFeedbackReply,
  updateFeedbackRequest,
} from '../services/feedback.service.ts';

const allowedSorts: PublicFeedbackSort[] = ['trending', 'new', 'top', 'all'];

export async function getPublicFeedbacks(req: Request, res: Response) {
  const sortParam =
    typeof req.query.sort === 'string' ? req.query.sort : 'trending';
  const sort = (
    allowedSorts.includes(sortParam as PublicFeedbackSort)
      ? sortParam
      : 'trending'
  ) as PublicFeedbackSort;

  const feedbacks = await getPublicFeedbackFeed(sort, req.auth);

  return res.status(200).json({
    feedbacks,
    meta: {
      sort,
      total: feedbacks.length,
    },
  });
}

export async function getPublicFeedback(req: Request, res: Response) {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = Number.parseInt(rawId, 10);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid feedback id' });
  }

  const feedback = await getPublicFeedbackById(id, req.auth);
  if (!feedback) {
    return res.status(404).json({ message: 'Feedback not found' });
  }

  return res.status(200).json({ feedback });
}

export async function getFeedbackTypes(_req: Request, res: Response) {
  const feedbackTypes = await getAllFeedbackTypes();
  return res.status(200).json({ feedbackTypes });
}

export async function getReplies(req: Request, res: Response) {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = Number.parseInt(rawId, 10);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid feedback id' });
  }

  const replies = await getFeedbackReplies(id, req.auth);
  return res.status(200).json({ replies });
}

export async function postReply(req: Request, res: Response) {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = Number.parseInt(rawId, 10);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid feedback id' });
  }

  const content =
    typeof req.body?.content === 'string' ? req.body.content.trim() : '';
  const parentReplyId = Number.parseInt(String(req.body?.parentReplyId), 10);
  const normalizedParentReplyId =
    Number.isInteger(parentReplyId) && parentReplyId > 0
      ? parentReplyId
      : undefined;
  const visibility =
    req.body?.visibility === 'public'
      ? 'public'
      : req.body?.visibility === 'anonymous'
        ? 'anonymous'
        : null;
  if (content.length < 2) {
    return res
      .status(400)
      .json({ message: 'Reply must be at least 2 characters long' });
  }
  if (content.length > 1000) {
    return res
      .status(400)
      .json({ message: 'Reply must be at most 1000 characters long' });
  }

  if (!visibility) {
    return res
      .status(400)
      .json({ message: 'Please choose visibility: anonymous or public' });
  }

  if (!req.auth && visibility !== 'anonymous') {
    return res.status(400).json({
      message:
        'Please choose anonymous visibility when submitting without an account',
    });
  }

  let reply;
  try {
    reply = await createFeedbackReply(
      id,
      req.auth?.id ?? null,
      req.auth?.type ?? null,
      content,
      !req.auth || visibility === 'anonymous',
      normalizedParentReplyId,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to post reply';
    if (message === 'Invalid parent reply') {
      return res.status(400).json({ message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }

  if (!reply) {
    return res.status(404).json({ message: 'Feedback not found' });
  }

  return res.status(201).json({ message: 'Reply posted', reply });
}

export async function voteReply(req: Request, res: Response) {
  const rawFeedbackId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const feedbackId = Number.parseInt(rawFeedbackId, 10);
  const rawReplyId = Array.isArray(req.params.replyId)
    ? req.params.replyId[0]
    : req.params.replyId;
  const replyId = Number.parseInt(rawReplyId, 10);

  if (
    !Number.isFinite(feedbackId) ||
    feedbackId <= 0 ||
    !Number.isFinite(replyId) ||
    replyId <= 0
  ) {
    return res.status(400).json({ message: 'Invalid feedback or reply id' });
  }

  if (!req.auth) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const direction = req.body?.direction as 'up' | 'down' | undefined;
  if (direction !== 'up' && direction !== 'down') {
    return res
      .status(400)
      .json({ message: 'direction must be either "up" or "down"' });
  }

  const voted = await voteOnReply(
    feedbackId,
    replyId,
    direction,
    req.auth.id,
    req.auth.type,
  );

  if (!voted) {
    return res.status(404).json({ message: 'Reply not found' });
  }

  return res.status(200).json({
    message: `${direction === 'up' ? 'Upvote' : 'Downvote'} handled`,
    action: voted.action,
    userVote: voted.userVote,
    reply: {
      id: voted.reply.id,
      upvotes: voted.reply.upvotes,
      downvotes: voted.reply.downvotes,
    },
  });
}

export async function patchFeedback(req: Request, res: Response) {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = Number.parseInt(rawId, 10);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid feedback id' });
  }

  if (!req.auth) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const title =
    typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  const description =
    typeof req.body?.description === 'string' ? req.body.description : '';

  if (title.length < 5) {
    return res
      .status(400)
      .json({ message: 'Title must be at least 5 characters long' });
  }

  if (description.length > 1000) {
    return res
      .status(400)
      .json({ message: 'Description must be at most 1000 characters long' });
  }

  const result = await updateFeedbackRequest(id, req.auth, {
    title,
    description,
  });

  if (result.kind === 'not_found') {
    return res.status(404).json({ message: 'Feedback not found' });
  }

  if (result.kind === 'forbidden') {
    return res
      .status(403)
      .json({ message: 'You can only edit your own feedback request' });
  }

  return res.status(200).json({
    message: 'Feedback updated',
    feedback: result.feedback,
  });
}

export async function patchReply(req: Request, res: Response) {
  const rawFeedbackId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const feedbackId = Number.parseInt(rawFeedbackId, 10);
  const rawReplyId = Array.isArray(req.params.replyId)
    ? req.params.replyId[0]
    : req.params.replyId;
  const replyId = Number.parseInt(rawReplyId, 10);

  if (
    !Number.isFinite(feedbackId) ||
    feedbackId <= 0 ||
    !Number.isFinite(replyId) ||
    replyId <= 0
  ) {
    return res.status(400).json({ message: 'Invalid feedback or reply id' });
  }

  if (!req.auth) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const content =
    typeof req.body?.content === 'string' ? req.body.content.trim() : '';

  if (content.length < 2) {
    return res
      .status(400)
      .json({ message: 'Reply must be at least 2 characters long' });
  }
  if (content.length > 1000) {
    return res
      .status(400)
      .json({ message: 'Reply must be at most 1000 characters long' });
  }

  const result = await updateFeedbackReply(
    feedbackId,
    replyId,
    req.auth,
    content,
  );

  if (result.kind === 'not_found') {
    return res.status(404).json({ message: 'Reply not found' });
  }

  if (result.kind === 'forbidden') {
    return res
      .status(403)
      .json({ message: 'You can only edit your own reply' });
  }

  return res.status(200).json({
    message: 'Reply updated',
    reply: result.reply,
  });
}
