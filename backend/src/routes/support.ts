import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all tickets
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status } = req.query;
    
    const where: any = {};
    if (status) where.status = status;

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: { user: true, messages: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get ticket by ID
router.get('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: req.params.id },
      include: { user: true, messages: true }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add message to ticket
router.post('/:id/messages', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { message } = req.body;

    const ticketMessage = await prisma.ticketMessage.create({
      data: {
        ticketId: req.params.id,
        sender: 'support',
        message
      }
    });

    res.json(ticketMessage);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update ticket status
router.patch('/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;

    const ticket = await prisma.supportTicket.update({
      where: { id: req.params.id },
      data: { status }
    });

    await prisma.auditLog.create({
      data: {
        staff: req.userId!,
        action: 'Update Ticket Status',
        target: req.params.id,
        reason: `Status changed to ${status}`
      }
    });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
