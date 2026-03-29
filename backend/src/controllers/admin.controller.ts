import type { Request, Response } from 'express';
import * as adminService from '../services/admin.service.ts';
import logger from '../utils/logger.ts';

export async function getStats(req: Request, res: Response) {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    logger.error('Error fetching admin stats', { error });
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getCompanies(req: Request, res: Response) {
  try {
    const search = req.query.search as string;
    const companies = await adminService.getAllCompaniesForAdmin(search);
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function verifyCompany(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body; // boolean
    const company = await adminService.toggleCompanyVerification(Number(id), status);
    res.json({ message: 'Company verification updated', company });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
}

export async function removeCompany(req: Request, res: Response) {
  try {
    await adminService.deleteCompany(Number(req.params.id));
    res.json({ message: 'Company deleted successfully' });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
}

export async function getFeedbacks(req: Request, res: Response) {
  try {
    const feedbacks = await adminService.getAllFeedbacksForAdmin();
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function removeFeedback(req: Request, res: Response) {
  try {
    await adminService.deleteFeedback(Number(req.params.id));
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
}

export async function removeReply(req: Request, res: Response) {
  try {
    await adminService.deleteReply(Number(req.params.id));
    res.json({ message: 'Reply deleted successfully' });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
}
