import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

// Get notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.findAll({ where: { userId: req.params.userId }, order: [['createdAt', 'DESC']] });
    res.json(notifications);
  } catch (e) {
    console.error('Error fetching notifications:', e);
    res.status(400).json({ error: e.message });
  }
});

// Create or update notification
router.post('/', async (req, res) => {
  const { id, userId, message, type, read } = req.body;
  // Basic validation
  if (!userId || !message || !type) {
    return res.status(400).json({ error: 'userId, message, and type are required.' });
  }
  try {
    let notification;
    if (id) {
      notification = await Notification.findByPk(id);
      if (notification) {
        await notification.update({ userId, message, type, read });
        await notification.reload();
        return res.json(notification);
      }
    }
    notification = await Notification.create({ userId, message, type, read });
    return res.status(201).json(notification);
  } catch (e) {
    console.error('Error creating/updating notification:', e);
    res.status(400).json({ error: e.message });
  }
});

// TODO: Add authentication middleware if needed, e.g. router.use(authMiddleware);

// Get notification by id
router.get('/:id', async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'id is required' });
    }
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (e) {
    console.error('Error fetching notification:', e);
    res.status(400).json({ error: e.message });
  }
});

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Not found' });
    await notification.update({ read: true });
    await notification.reload();
    res.json(notification);
  } catch (e) {
    console.error('Error updating notification:', e);
    res.status(400).json({ error: e.message });
  }
});

export default router;
