import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { AppError } from 'errors/appError';

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }
};