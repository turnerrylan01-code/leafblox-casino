import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Create promo code
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { code, rewardAmount, expirationDate, usageLimit, userRestrictions } = req.body;

    const promo = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        rewardAmount: parseFloat(rewardAmount),
        expirationDate: new Date(expirationDate),
        usageLimit: parseInt(usageLimit),
        userRestrictions
      }
    });

    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Create Promo',
        target: code,
        reason: 'New promo code created'
      }
    });

    res.json(promo);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all promo codes
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const promos = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(promos);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update promo code
router.patch('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const promo = await prisma.promoCode.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json(promo);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Disable promo code
router.patch('/:id/disable', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const promo = await prisma.promoCode.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });

    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Disable Promo',
        target: promo.code,
        reason: 'Promo disabled by admin'
      }
    });

    res.json(promo);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
