import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Create ban
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { userId, type, duration, reason } = req.body;

    const expiresAt = type === 'temporary' 
      ? new Date(Date.now() + parseInt(duration) * 60 * 60 * 1000)
      : null;

    const ban = await prisma.ban.create({
      data: {
        userId,
        type,
        reason,
        issuedBy: req.userId!,
        expiresAt
      }
    });

    // Update user status
    await prisma.user.update({
      where: { id: userId },
      data: { accountStatus: 'banned' }
    });

    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Ban User',
        target: userId,
        reason
      }
    });

    res.json(ban);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all bans
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const bans = await prisma.ban.findMany({
      include: { user: true },
      orderBy: { issuedAt: 'desc' }
    });

    res.json(bans);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Lift ban
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const ban = await prisma.ban.findUnique({
      where: { id: req.params.id }
    });

    if (!ban) {
      return res.status(404).json({ error: 'Ban not found' });
    }

    await prisma.ban.delete({
      where: { id: req.params.id }
    });

    // Update user status
    await prisma.user.update({
      where: { id: ban.userId },
      data: { accountStatus: 'active' }
    });

    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Lift Ban',
        target: ban.userId,
        reason: 'Ban lifted by admin'
      }
    });

    res.json({ message: 'Ban lifted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
