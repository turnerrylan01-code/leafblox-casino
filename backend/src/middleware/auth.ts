import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userRole !== 'owner' && req.userRole !== 'admin' && req.userRole !== 'dev') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const requireOwner = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userRole !== 'owner') {
    return res.status(403).json({ error: 'Owner access required' });
  }
  next();
};
