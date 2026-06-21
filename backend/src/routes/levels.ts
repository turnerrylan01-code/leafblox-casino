import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all levels
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const levels = await prisma.level.findMany({
      orderBy: { level: 'asc' }
    });

    res.json(levels);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create level
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { level, title, xpRequired, reward } = req.body;

    const newLevel = await prisma.level.create({
      data: {
        level: parseInt(level),
        title,
        xpRequired: parseInt(xpRequired),
        reward
      }
    });

    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Create Level',
        target: title,
        reason: 'New level created'
      }
    });

    res.json(newLevel);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update level
router.patch('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const level = await prisma.level.update({
      where: { id: req.params.id },
      data: req.body
    });

    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Update Level',
        target: level.title,
        reason: 'Level updated'
      }
    });

    res.json(level);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete level
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    await prisma.level.delete({
      where: { id: req.params.id }
    });

    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Delete Level',
        target: req.params.id,
        reason: 'Level deleted'
      }
    });

    res.json({ message: 'Level deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
