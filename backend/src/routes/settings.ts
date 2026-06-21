import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get settings
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const settings = await prisma.settings.findFirst();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update settings
router.patch('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const settings = await prisma.settings.upsert({
      where: { id: 'default' },
      create: { id: 'default', ...req.body },
      update: req.body
    });

    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Update Settings',
        target: 'System',
        reason: 'Settings updated by admin'
      }
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
