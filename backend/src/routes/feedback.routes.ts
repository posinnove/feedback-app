import { Router } from 'express';
import {
  getFeedbackTypes,
  getReplies,
  postReply,
  patchReply,
  patchFeedback,
  voteReply,
  voteFeedback,
  getPublicFeedback,
  getPublicFeedbacks,
} from '../controllers/feedback.controller.ts';
import {
  authenticate,
  optionalAuthenticate,
  resolveAnonToken,
} from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/types', getFeedbackTypes);
// resolveAnonToken on read routes so anon visitors see their own userVote
router.get('/', resolveAnonToken, optionalAuthenticate, getPublicFeedbacks);
router.get('/:id/replies', resolveAnonToken, optionalAuthenticate, getReplies);
router.post('/:id/replies', resolveAnonToken, optionalAuthenticate, postReply);
router.patch('/:id/replies/:replyId', authenticate, patchReply);
// Voting – open to authenticated OR anonymous visitors
router.post('/:id/vote', resolveAnonToken, optionalAuthenticate, voteFeedback);
router.post('/:id/replies/:replyId/vote', resolveAnonToken, optionalAuthenticate, voteReply);
router.patch('/:id', authenticate, patchFeedback);
router.get('/:id', resolveAnonToken, optionalAuthenticate, getPublicFeedback);

export default router;
