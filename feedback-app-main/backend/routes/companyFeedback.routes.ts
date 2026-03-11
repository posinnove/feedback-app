import { Router } from 'express'
import {
  getCompanyFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  createCompanyPost,
  getFeedbackReplies,
  addCompanyReply,
} from '../controllers/companyFeedback.controller'
import { upload } from "../middleware/upload";

const router = Router()

router.get('/', getCompanyFeedback)
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createCompanyPost
);

router.get('/:id', getFeedbackById)
router.patch('/:id/status', updateFeedbackStatus)

router.get('/:id/replies', getFeedbackReplies)
router.post('/:id/replies', addCompanyReply)

export default router
