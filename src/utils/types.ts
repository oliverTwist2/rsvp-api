import { Types } from 'mongoose';

export interface AdminDTO {
  _id: Types.ObjectId | string;
  email: string;
  username: string;
}

// token payload type (used by generateToken)
export interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
}
