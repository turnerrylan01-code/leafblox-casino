import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all games
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const games = await prisma.game.findMany();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update game settings
router.patch('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const game = await prisma.game.update({
      where: { id: req.params.id },
      data: req.body
    });

    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Update Game Settings',
        target: game.name,
        reason: 'Game settings updated'
      }
    });

    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle game enabled status
router.patch('/:id/toggle', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const game = await prisma.game.findUnique({
      where: { id: req.params.id }
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const updated = await prisma.game.update({
      where: { id: req.params.id },
      data: { enabled: !game.enabled }
    });

    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Toggle Game',
        target: game.name,
        reason: `Game ${updated.enabled ? 'enabled' : 'disabled'}`
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
