import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all audit logs
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { action, staff } = req.query;
    
    const where: any = {};
    if (action) where.action = { contains: action as string, mode: 'insensitive' };
    if (staff) where.staff = staff;

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 100
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
