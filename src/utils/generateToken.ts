import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import config from '../config';
import { TokenPayload } from './types';

export const generateToken = (
  payload: TokenPayload,
  expiresIn: SignOptions['expiresIn'] = config.JWT_EXPIRES_IN as SignOptions['expiresIn']
): string => {
  const secret: Secret | undefined = config.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret not configured');
  }

  const options: SignOptions = { expiresIn };

  return jwt.sign(payload as string | object | Buffer, secret, options);
};
