import { Router } from "express";
import {
  getCompanyFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  createCompanyPost,
  getFeedbackReplies,
  addCompanyReply,
} from "../controllers/companyFeedback.controller";

const router = Router();

router.get("/", getCompanyFeedback);
router.post("/", createCompanyPost);

router.get("/:id", getFeedbackById);
router.patch("/:id/status", updateFeedbackStatus);

router.get("/:id/replies", getFeedbackReplies);
router.post("/:id/replies", addCompanyReply);

export default router;