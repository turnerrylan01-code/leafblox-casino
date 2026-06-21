import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Register (for initial admin setup)
router.post('/register', async (req, res) => {
  try {
    const { username, email, walletAddress, role } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
          { walletAddress }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        walletAddress,
        accountStatus: 'active'
      }
    });

    // Add to staff if role is provided
    if (role && (role === 'admin' || role === 'moderator')) {
      await prisma.staff.create({
        data: {
          userId: user.id,
          role,
          addedBy: 'system'
        }
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: role || 'user' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
    );

    res.json({ token, user: { id: user.id, username, role: role || 'user' } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login with wallet
router.post('/login', async (req, res) => {
  try {
    const { walletAddress } = req.body;

    let user = await prisma.user.findUnique({
      where: { walletAddress },
      include: { staff: true }
    });

    if (!user) {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          username: `User_${walletAddress.slice(0, 8)}`,
          walletAddress,
          accountStatus: 'active'
        },
        include: { staff: true }
      });
      user = newUser;
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    const role = user.staff?.role || 'user';

    const token = jwt.sign(
      { userId: user.id, role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
    );

    res.json({ token, user: { id: user.id, username: user.username, role } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { staff: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.staff?.role || 'user'
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
