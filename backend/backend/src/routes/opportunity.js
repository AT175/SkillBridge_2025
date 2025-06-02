import express from 'express';
import Opportunity from '../models/Opportunity.js';

const router = express.Router();

// List all opportunities
router.get('/', async (req, res) => {
  try {
    const opportunities = await Opportunity.findAll();
    res.json(opportunities);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Create or update opportunity
router.post('/', async (req, res) => {
  const { id, roleTitle, description, requiredSkills, workLocation, businessId, numVolunteers, deadline } = req.body;
  // Basic validation
  if (!roleTitle || !description || !requiredSkills || !workLocation || !businessId) {
    return res.status(400).json({ error: 'roleTitle, description, requiredSkills, workLocation, and businessId are required.' });
  }
  try {
    let opportunity;
    if (id) {
      opportunity = await Opportunity.findByPk(id);
      if (opportunity) {
        await opportunity.update({ roleTitle, description, requiredSkills, workLocation, businessId, numVolunteers, deadline });
        await opportunity.reload();
        return res.json(opportunity);
      }
    }
    opportunity = await Opportunity.create({ roleTitle, description, requiredSkills, workLocation, businessId, numVolunteers, deadline });
    return res.status(201).json(opportunity);
  } catch (e) {
    console.error('Error creating/updating opportunity:', e);
    res.status(400).json({ error: e.message });
  }
});

// TODO: Add authentication middleware if needed, e.g. router.use(authMiddleware);

// Get opportunity by id
router.get('/:id', async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'id is required' });
    }
    const opportunity = await Opportunity.findByPk(req.params.id);
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
    res.json(opportunity);
  } catch (e) {
    console.error('Error fetching opportunity:', e);
    res.status(400).json({ error: e.message });
  }
});

export default router;
