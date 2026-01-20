import jwt from 'jsonwebtoken';
import { Request, Response, NextleFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        telegramId: number;
      };
    }
  }
}

export const generateToken = (userId: string, telegramId: number) => {
  return jwt.sign(
    { id: userId, telegramId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
};

export const authMiddleware = (req: Request, res: Response, next: NextleFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = decoded as any;
  next();
};
