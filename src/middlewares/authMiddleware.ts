import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/appError';
import { verifyToken } from '../utils/verifyToken';

export interface AuthenticatedAdmin {
  id: string;
  email?: string;
  _id?: string;
}

export interface AuthenticatedRequest extends Request {
  admin?: AuthenticatedAdmin;
}

export const protectRoute = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401));
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded.id || !decoded.email) {
    return next(new AppError('Invalid token payload', 401));
  }

  req.admin = { id: decoded.id, email: decoded.email };
  next();
};