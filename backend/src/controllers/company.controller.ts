import type { Request, Response } from 'express';
import {
  createFeedbackRequest as createFeedbackRequestService,
  followCompany as followCompanyService,
  getAllCompanies as getAllCompaniesService,
  getFollowedCompanies as getFollowedCompaniesService,
  unfollowCompany as unfollowCompanyService,
  voteOnFeedback as voteOnFeedbackService,
  updateFeedbackStatus as updateFeedbackStatusService,
} from '../services/company.service.ts';
import { getAnonVoterIdFromFingerprint } from '../utils/anonVoter.ts';
import logger from '../utils/logger.ts';

export async function getAllCompanies(_req: Request, res: Response) {
  try {
    const companies = await getAllCompaniesService();
    res.json(companies);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Error fetching companies:', { message });
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getCompanyBySlug(_req: Request, res: Response) {
  res.json(res.locals.company);
}

export async function getFollowedCompanies(req: Request, res: Response) {
  try {
    const auth = req.auth;
    if (!auth) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const companies = await getFollowedCompaniesService(auth.id, auth.type);
    res.json(companies);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Error fetching followed companies:', { message });
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function followCompany(req: Request, res: Response) {
  try {
    const company = res.locals.company as { id: number } | undefined;
    const auth = req.auth;

    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }
    if (!auth) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await followCompanyService(company.id, auth.id, auth.type);
    res.json({
      message: 'Company followed',
      followed: result.followed,
      followerCount: result.followerCount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Error following company:', { message });
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function unfollowCompany(req: Request, res: Response) {
  try {
    const company = res.locals.company as { id: number } | undefined;
    const auth = req.auth;

    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }
    if (!auth) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await unfollowCompanyService(company.id, auth.id, auth.type);
    res.json({
      message: 'Company unfollowed',
      followed: result.followed,
      followerCount: result.followerCount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Error unfollowing company:', { message });
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function voteOnFeedback(req: Request, res: Response) {
  try {
    const company = res.locals.company as { id: number } | undefined;
    const feedbackId = Number(req.params.feedbackId);
    const direction = req.body?.direction as 'up' | 'down' | undefined;
    const auth = req.auth;

    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    if (!Number.isInteger(feedbackId) || feedbackId <= 0) {
      res.status(400).json({ message: 'Invalid feedback id' });
      return;
    }

    if (direction !== 'up' && direction !== 'down') {
      res
        .status(400)
        .json({ message: 'direction must be either "up" or "down"' });
      return;
    }

    const voterId =
      auth?.id ??
      (req.anonFingerprint
        ? getAnonVoterIdFromFingerprint(req.anonFingerprint)
        : undefined);
    const voterType = auth?.type ?? (voterId ? 'user' : undefined);

    const feedback = await voteOnFeedbackService(
      company.id,
      feedbackId,
      direction,
      voterId,
      voterType,
    );
    if (!feedback) {
      res.status(404).json({ message: 'Feedback not found' });
      return;
    }

    res.json({
      message: `${direction === 'up' ? 'Upvote' : 'Downvote'} handled`,
      action: feedback.action,
      userVote: feedback.userVote,
      feedback: {
        id: feedback.feedback.id,
        upvotes: feedback.feedback.upvotes,
        downvotes: feedback.feedback.downvotes,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Error voting on feedback:', { message });
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function createFeedbackRequest(req: Request, res: Response) {
  try {
    const company = res.locals.company as { id: number } | undefined;
    const auth = req.auth;
    const title =
      typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    const description =
      typeof req.body?.description === 'string' ? req.body.description : '';
    const visibility =
      req.body?.visibility === 'public' ? 'public' : 'anonymous';
    const feedbackTypeId = Number.parseInt(
      String(req.body?.feedbackTypeId),
      10,
    );

    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    if (auth?.type === 'company') {
      res
        .status(403)
        .json({ message: 'Company accounts cannot submit feedback requests' });
      return;
    }

    if (!auth && visibility !== 'anonymous') {
      res.status(400).json({
        message:
          'Please choose anonymous visibility when submitting without an account',
      });
      return;
    }

    if (title.length < 5) {
      res
        .status(400)
        .json({ message: 'Title must be at least 5 characters long' });
      return;
    }

    if (description.length > 1000) {
      res
        .status(400)
        .json({ message: 'Description must be at most 1000 characters long' });
      return;
    }

    if (!Number.isInteger(feedbackTypeId) || feedbackTypeId <= 0) {
      res.status(400).json({ message: 'Please select a valid feedback type' });
      return;
    }

    const feedback = await createFeedbackRequestService(company.id, {
      title,
      description,
      feedbackTypeId,
      requesterUserId: auth?.type === 'user' ? auth.id : null,
      isAnonymous: !auth || visibility === 'anonymous',
    });

    res.status(201).json({
      message: 'Feedback request submitted',
      feedback,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (message === 'Invalid feedback type') {
      res.status(400).json({ message });
      return;
    }
    logger.error('Error creating feedback request:', { message });
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateFeedbackStatus(req: Request, res: Response) {
  try {
    const company = res.locals.company as { id: number } | undefined;
    const auth = req.auth;
    const feedbackId = Number(req.params.feedbackId);
    const newStatus = req.body?.status as string | undefined;

    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    if (!auth || auth.type !== 'company') {
      res
        .status(403)
        .json({ message: 'Only companies can update feedback status' });
      return;
    }

    if (auth.id !== company.id) {
      res
        .status(403)
        .json({ message: 'You can only update feedback for your own company' });
      return;
    }

    if (!Number.isInteger(feedbackId) || feedbackId <= 0) {
      res.status(400).json({ message: 'Invalid feedback id' });
      return;
    }

    if (
      !newStatus ||
      ![
        'planned',
        'in-progress',
        'under-review',
        'completed',
        'rejected',
      ].includes(newStatus)
    ) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    const feedback = await updateFeedbackStatusService(
      feedbackId,
      company.id,
      newStatus,
    );

    res.json({
      message: 'Feedback status updated',
      feedback,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Error updating feedback status:', { message });
    res.status(500).json({ message: 'Internal server error' });
  }
}
