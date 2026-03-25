import { Router } from 'express';
import {
  getFeedbackTypes,
  getReplies,
  postReply,
  patchReply,
  patchFeedback,
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
router.post('/:id/replies', optionalAuthenticate, postReply);
router.patch('/:id/replies/:replyId', authenticate, patchReply);
router.post('/:id/replies/:replyId/vote', optionalAuthenticate, voteReply);
router.patch('/:id', authenticate, patchFeedback);
router.get('/:id', optionalAuthenticate, getPublicFeedback);

export default router;
