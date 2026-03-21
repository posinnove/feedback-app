import { Router } from 'express';
import {
  getFeedbackTypes,
  getReplies,
  postReply,
  voteReply,
  getPublicFeedback,
  getPublicFeedbacks,
} from '../controllers/feedback.controller.ts';
import {
  authenticate,
  optionalAuthenticate,
} from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/types', getFeedbackTypes);
router.get('/', optionalAuthenticate, getPublicFeedbacks);
router.get('/:id/replies', optionalAuthenticate, getReplies);
router.post('/:id/replies', authenticate, postReply);
router.post('/:id/replies/:replyId/vote', authenticate, voteReply);
router.get('/:id', optionalAuthenticate, getPublicFeedback);

export default router;
