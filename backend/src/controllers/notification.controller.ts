import type { Request, Response } from 'express';
import {
  getUnreadNotifications,
  markNotificationsAsRead,
} from '../services/notification.service.ts';

export async function getNotifications(req: Request, res: Response) {
  try {
    if (!req.auth) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const notifications = await getUnreadNotifications(
      req.auth.id,
      req.auth.type,
    );
    res.json({
      notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
}

export async function markAsRead(req: Request, res: Response) {
  try {
    if (!req.auth) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const { notificationIds } = req.body;
    await markNotificationsAsRead(req.auth.id, req.auth.type, notificationIds);
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark notifications as read' });
  }
}
