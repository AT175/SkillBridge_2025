import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Get messages between two users
router.get('/:userId/:otherUserId', async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    const messages = await Message.findAll({
      where: {
        [Message.sequelize.Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      },
      order: [['createdAt', 'ASC']]
    });
    res.json(messages);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Send a message
router.post('/', async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  try {
    const message = await Message.create({ senderId, receiverId, content });
    res.status(201).json(message);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Mark message as read
router.patch('/:id/read', async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: 'Not found' });
    await message.update({ read: true });
    res.json(message);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
