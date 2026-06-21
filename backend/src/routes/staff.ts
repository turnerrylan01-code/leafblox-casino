import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, requireOwner, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all staff
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const staff = await prisma.staff.findMany({
      include: { user: true },
      orderBy: { addedAt: 'desc' }
    });

    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add staff member
router.post('/', authenticate, requireOwner, async (req: AuthRequest, res) => {
  try {
    const { walletAddress, role } = req.body;

    const user = await prisma.user.findUnique({
      where: { walletAddress }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const staff = await prisma.staff.create({
      data: {
        userId: user.id,
        role,
        addedBy: req.userId!
      }
    });

    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Add Staff',
        target: user.username,
        reason: `Added as ${role}`
      }
    });

    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update staff role
router.patch('/:id', authenticate, requireOwner, async (req: AuthRequest, res) => {
  try {
    const { role } = req.body;

    const staff = await prisma.staff.update({
      where: { id: req.params.id },
      data: { role }
    });

    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Update Staff Role',
        target: staff.userId,
        reason: `Role changed to ${role}`
      }
    });

    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove staff member
router.delete('/:id', authenticate, requireOwner, async (req: AuthRequest, res) => {
  try {
    await prisma.staff.delete({
      where: { id: req.params.id }
    });

    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Remove Staff',
        target: req.params.id,
        reason: 'Staff member removed'
      }
    });

    res.json({ message: 'Staff member removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
