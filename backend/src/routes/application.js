import express from 'express';
import Application from '../models/Application.js';

const router = express.Router();

// List all applications for a volunteer
router.get('/volunteer/:volunteerId', async (req, res) => {
  try {
    const applications = await Application.findAll({ where: { volunteerId: req.params.volunteerId } });
    res.json(applications);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// List all applications for an opportunity
router.get('/opportunity/:opportunityId', async (req, res) => {
  try {
    const applications = await Application.findAll({ where: { opportunityId: req.params.opportunityId } });
    res.json(applications);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Apply to an opportunity
router.post('/', async (req, res) => {
  const { volunteerId, opportunityId, message } = req.body;
  try {
    const application = await Application.create({ volunteerId, opportunityId, message });
    res.status(201).json(application);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Update application status (accept/reject)
router.patch('/:id', async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) return res.status(404).json({ error: 'Not found' });
    await application.update(req.body);
    res.json(application);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
