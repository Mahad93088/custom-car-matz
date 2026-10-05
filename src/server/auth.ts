import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './database/db.ts';
import { User } from './database/types.ts';

const JWT_SECRET = process.env.AUTH_SECRET || 'custom-car-mats-jwt-secret-key-british-luxury-2026';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { id: string; email: string; role: string; name: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (err) {
    return null;
  }
}

/**
 * Middleware requiring ANY authenticated user (Customer or Staff)
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split('Bearer ')[1].trim();
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }

  const user = db.findUserById(payload.id);
  if (!user) {
    return res.status(401).json({ error: 'User account not found.' });
  }

  req.user = user;
  next();
}

/**
 * Middleware requiring Admin or Staff role.
 * Customer role is strictly rejected with 403 Forbidden.
 */
export function requireAdminRole(allowedRoles?: Array<'super_admin' | 'admin' | 'content_manager' | 'order_manager'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
    }

    const token = authHeader.split('Bearer ')[1].trim();
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Session expired. Please log in to admin CMS.' });
    }

    const user = db.findUserById(payload.id);
    if (!user) {
      return res.status(401).json({ error: 'Admin account not found.' });
    }

    // Role check: must be a staff role
    const staffRoles = ['super_admin', 'admin', 'content_manager', 'order_manager'];
    if (!staffRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden: Admin access denied.' });
    }

    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role as any)) {
        return res.status(403).json({
          error: `Forbidden: Your role (${user.role}) does not have permission to perform this action.`
        });
      }
    }

    req.user = user;
    next();
  };
}
