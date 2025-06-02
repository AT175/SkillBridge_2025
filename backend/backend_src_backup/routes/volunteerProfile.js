import express from 'express';
import VolunteerProfile from '../models/VolunteerProfile.js';
import User from '../models/User.js';

const router = express.Router();

// TODO: Add authentication middleware if needed, e.g. router.use(authMiddleware);

// Get volunteer profile by userId
router.get('/:userId', async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const profile = await VolunteerProfile.findOne({ where: { userId: req.params.userId } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (e) {
    console.error('Error fetching volunteer profile:', e);
    res.status(400).json({ error: e.message });
  }
});

// Create or update volunteer profile
router.post('/', async (req, res) => {
  const { userId, fullName, skills, experience, contactInfo, resumeUrl } = req.body;
  // Basic validation
  if (!userId || !fullName || !skills || !contactInfo) {
    return res.status(400).json({ error: 'userId, fullName, skills, and contactInfo are required.' });
  }
  try {
    let profile = await VolunteerProfile.findOne({ where: { userId } });
    if (profile) {
      await profile.update({ fullName, skills, experience, contactInfo, resumeUrl });
      // Reload to get latest values
      await profile.reload();
      return res.json(profile);
    } else {
      profile = await VolunteerProfile.create({ userId, fullName, skills, experience, contactInfo, resumeUrl });
      return res.status(201).json(profile);
    }
  } catch (e) {
    console.error('Error creating/updating volunteer profile:', e);
    res.status(400).json({ error: e.message });
  }
});

export default router;
