import { Router } from 'express';
import {
  createFeedbackRequest,
  followCompany,
  getAllCompanies,
  getCompanyBySlug,
  getFollowedCompanies,
  unfollowCompany,
  voteOnFeedback,
  updateFeedbackStatus,
} from '../controllers/company.controller.ts';
import {
  authenticate,
  optionalAuthenticate,
  requireType,
} from '../middleware/auth.middleware.ts';
import { validateSlug } from '../middleware/slug.validation.ts';
import { resolveCompany } from '../middleware/resolve-company.ts';

const router = Router();

router.get('/', getAllCompanies);
router.get('/following', authenticate, getFollowedCompanies);
router.get(
  '/:slug',
  validateSlug,
  optionalAuthenticate,
  resolveCompany,
  getCompanyBySlug,
);
router.post(
  '/:slug/follow',
  validateSlug,
  resolveCompany,
  authenticate,
  followCompany,
);
router.delete(
  '/:slug/follow',
  validateSlug,
  resolveCompany,
  authenticate,
  unfollowCompany,
);
router.post(
  '/:slug/feedback/:feedbackId/vote',
  validateSlug,
  resolveCompany,
  authenticate,
  voteOnFeedback,
);
router.post(
  '/:slug/feedback',
  validateSlug,
  resolveCompany,
  optionalAuthenticate,
  createFeedbackRequest,
);

router.patch(
  '/:slug/feedback/:feedbackId/status',
  validateSlug,
  resolveCompany,
  authenticate,
  requireType('company'),
  updateFeedbackStatus,
);

export default router;
