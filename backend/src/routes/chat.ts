import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Mute user
router.post('/mute', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { userId, duration, reason } = req.body;

    const mute = await prisma.mute.create({
      data: {
        userId,
        duration,
        reason,
        issuedBy: req.userId!
      }
    });

    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Mute User',
        target: userId,
        reason
      }
    });

    res.json(mute);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Unmute user
router.delete('/mute/:userId', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    await prisma.mute.deleteMany({
      where: { userId: req.params.userId }
    });

    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Unmute User',
        target: req.params.userId,
        reason: 'Unmuted by admin'
      }
    });

    res.json({ message: 'User unmuted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get active mutes
router.get('/mutes', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const mutes = await prisma.mute.findMany({
      include: { user: true },
      orderBy: { issuedAt: 'desc' }
    });

    res.json(mutes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Clear chat (log action)
router.post('/clear', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Clear Chat',
        target: 'Chat',
        reason: 'Chat cleared by admin'
      }
    });

    res.json({ message: 'Chat cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
