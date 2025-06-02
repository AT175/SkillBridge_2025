import express from 'express';
import BusinessProfile from '../models/BusinessProfile.js';

const router = express.Router();

// TODO: Add authentication middleware if needed, e.g. router.use(authMiddleware);

// Get business profile by userId
router.get('/:userId', async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const profile = await BusinessProfile.findOne({ where: { userId: req.params.userId } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (e) {
    console.error('Error fetching business profile:', e);
    res.status(400).json({ error: e.message });
  }
});

// Create or update business profile
router.post('/', async (req, res) => {
  const { userId, companyName, background, contactInfo, logoUrl, documentsUrl } = req.body;
  // Basic validation
  if (!userId || !companyName || !background || !contactInfo) {
    return res.status(400).json({ error: 'userId, companyName, background, and contactInfo are required.' });
  }
  try {
    let profile = await BusinessProfile.findOne({ where: { userId } });
    if (profile) {
      await profile.update({ companyName, background, contactInfo, logoUrl, documentsUrl });
      // Reload to get latest values
      await profile.reload();
      return res.json(profile);
    } else {
      profile = await BusinessProfile.create({ userId, companyName, background, contactInfo, logoUrl, documentsUrl });
      return res.status(201).json(profile);
    }
  } catch (e) {
    console.error('Error creating/updating business profile:', e);
    res.status(400).json({ error: e.message });
  }
});

export default router;
