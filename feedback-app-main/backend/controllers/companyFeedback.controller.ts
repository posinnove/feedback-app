import { Request, Response } from "express";
import { Feedback } from "../models/feedback.model";
import { FeedbackReply } from "../models/feedbackReply.model";

/**
 * GET /api/company/feedback
 * Returns all feedback for a company
 */
export const getCompanyFeedback = async (
  req: Request,
  res: Response
) => {
  try {
    const companyId = 1;

    const feedback = await Feedback.findAll({
      where: { companyId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching company feedback:", error);
    return res.status(500).json({
      message: "Failed to fetch feedback",
    });
  }
};

/**
 * PATCH /api/company/feedback/:id/status
 * Update feedback status
 */
export const updateFeedbackStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "reviewed", "resolved"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const feedback = await Feedback.findOne({
      where: {
        id,
        companyId: 1, // TEMP
      },
    });

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    feedback.status = status;
    await feedback.save();

    return res.status(200).json(feedback);
  } catch (error) {
    console.error("Error updating feedback status:", error);
    return res.status(500).json({
      message: "Failed to update status",
    });
  }
};

/**
 * POST /api/company/feedback/:id/replies
 * Adds a company reply to feedback
 */
export const addCompanyReply = async (req: Request, res: Response) => {
  try {
    const feedbackId = Number(req.params.id);
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "message is required" });
    }

    // Ensure feedback exists and belongs to company (TEMP companyId = 1)
    const feedback = await Feedback.findOne({
      where: { id: feedbackId, companyId: 1 },
    });

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    const reply = await FeedbackReply.create({
      feedbackId,
      companyId: 1, // TEMP
      author: "COMPANY",
      message: message.trim(),
    });

    return res.status(201).json(reply);
  } catch (error) {
    console.error("Error adding company reply:", error);
    return res.status(500).json({ message: "Failed to add reply" });
  }
};
/**
 * GET /api/company/feedback/:id
 * Returns a single feedback by ID
 */
export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const feedbackId = Number(req.params.id);

    if (Number.isNaN(feedbackId)) {
      return res.status(400).json({ message: "Invalid feedback id" });
    }

    const feedback = await Feedback.findOne({
      where: {
        id: feedbackId,
        companyId: 1, // TEMP
      },
    });

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    return res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return res.status(500).json({ message: "Failed to fetch feedback" });
  }
};
/**
 * GET /api/company/feedback/:id/replies
 * Returns all replies for a feedback
 */
export const getFeedbackReplies = async (req: Request, res: Response) => {
  try {
    const feedbackId = Number(req.params.id);

    if (Number.isNaN(feedbackId)) {
      return res.status(400).json({ message: "Invalid feedback id" });
    }

    const replies = await FeedbackReply.findAll({
      where: { feedbackId },
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json(replies);
  } catch (error: any) {
  console.error("Error fetching replies FULL:", error);
  console.error("Message:", error?.message);
  console.error("Parent:", error?.parent);
  console.error("SQL:", error?.sql);
  return res.status(500).json({
    message: "Failed to fetch replies",
    detail: error?.message,
  });
}
};
/**
 * POST /api/company/feedback
 * Company creates a post (temporary companyId = 1)
 */
export const createCompanyPost = async (req: Request, res: Response) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "title, description, and category are required",
      });
    }

    const companyId = 1; // TEMP
    const created = await Feedback.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      companyId,
    });

    return res.status(201).json(created);
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ message: "Failed to create post" });
  }
};