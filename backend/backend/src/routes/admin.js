import express from 'express';
import User from '../models/User.js';
import BusinessProfile from '../models/BusinessProfile.js';
import VolunteerProfile from '../models/VolunteerProfile.js';
import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import Message from '../models/Message.js';
import { Op } from 'sequelize';

const router = express.Router();

// User Management
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.patch('/users/:id/suspend', async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'id is required' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.update({ isActive: false });
    res.json(await User.findByPk(req.params.id)); // reload updated record
  } catch (e) {
    console.error('Error suspending user:', e);
    res.status(400).json({ error: e.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'id is required' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ success: true });
  } catch (e) {
    console.error('Error deleting user:', e);
    res.status(400).json({ error: e.message });
  }
});

// Approve business before posting
router.get('/business/:id', async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'id is required' });
    }
    const business = await BusinessProfile.findByPk(req.params.id);
    if (!business) return res.status(404).json({ error: 'Business not found' });
    res.json(business);
  } catch (e) {
    console.error('Error fetching business:', e);
    res.status(400).json({ error: e.message });
  }
});

router.patch('/business/:id/approve', async (req, res) => {
  try {
    const business = await BusinessProfile.findByPk(req.params.id);
    if (!business) return res.status(404).json({ error: 'Not found' });
    await business.update({ approved: true });
    res.json(business);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Content Moderation
router.get('/opportunities', async (req, res) => {
  try {
    const opportunities = await Opportunity.findAll();
    res.json(opportunities);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/opportunities/:id', async (req, res) => {
  try {
    const opportunity = await Opportunity.findByPk(req.params.id);
    if (!opportunity) return res.status(404).json({ error: 'Not found' });
    await opportunity.destroy();
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Analytics (advanced)
router.get('/analytics', async (req, res) => {
  try {
    const userCount = await User.count();
    const businessCount = await User.count({ where: { role: 'business' } });
    const volunteerCount = await User.count({ where: { role: 'volunteer' } });
    const opportunityCount = await Opportunity.count();
    const applicationCount = await Application.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const suspendedUsers = await User.count({ where: { isActive: false } });
    res.json({ userCount, businessCount, volunteerCount, opportunityCount, applicationCount, activeUsers, suspendedUsers });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Report Management (CSV export)
router.get('/reports/users', async (req, res) => {
  try {
    const users = await User.findAll();
    let csv = 'id,name,email,role,isActive\n';
    users.forEach(u => {
      csv += `${u.id},${u.name},${u.email},${u.role},${u.isActive}\n`;
    });
    res.header('Content-Type', 'text/csv');
    res.attachment('users_report.csv');
    res.send(csv);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
