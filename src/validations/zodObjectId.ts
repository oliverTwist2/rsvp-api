import { z } from 'zod';
import mongoose from 'mongoose';

export const zodObjectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  });
