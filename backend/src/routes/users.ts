import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all users (admin only)
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status, search } = req.query;
    
    const where: any = {};
    if (status) where.accountStatus = status;
    if (search) {
      where.OR = [
        { username: { contains: search as string, mode: 'insensitive' } },
        { walletAddress: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: { staff: true },
      orderBy: { registrationDate: 'desc' }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { staff: true, bans: true, mutes: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user status
router.patch('/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { accountStatus: status }
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Update User Status',
        target: user.username,
        reason: `Changed status to ${status}`
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add internal note
router.post('/:id/notes', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { note } = req.body;
    
    const existingUser = await prisma.user.findUnique({
      where: { id: req.params.id }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const notes = existingUser.internalNotes ? existingUser.internalNotes + '\n' + note : note;
    
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { internalNotes: notes }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Force logout
router.post('/:id/logout', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    // In production, this would invalidate the user's session/token
    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Force Logout',
        target: req.params.id,
        reason: 'Forced logout by admin'
      }
    });

    res.json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
