import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { cacheGet, cacheSet } from '../config/redis';

interface AuthRequest extends Request {
  user?: any;
}

/* ===============================
   Authenticate Token
================================ */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access token is required' });
    return;
  }

  try {
    // Check Redis cache
    const cachedUser = await cacheGet(`token:${token}`);
    if (cachedUser) {
      req.user = JSON.parse(cachedUser);
      next();
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: number; role: string };

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid token - user not found' });
      return;
    }

    req.user = user;

    await cacheSet(`token:${token}`, JSON.stringify(user), 3600);

    next();
    return;
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
    return;
  }
};

/* ===============================
   Authorize Roles
================================ */
export const authorizeRoles =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res
        .status(403)
        .json({ message: 'Access denied. Insufficient permissions.' });
      return;
    }

    next();
    return;
  };

/* ===============================
   Default Export (Compatibility)
================================ */
export default {
  authenticateToken,
  authorizeRoles,
};
