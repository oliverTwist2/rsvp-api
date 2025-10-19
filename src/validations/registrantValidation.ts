import { z } from 'zod';
import { zodObjectId } from './zodObjectId';

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(3, 'Full name is required'),
    email: z.string().email('Invalid email format'),
    phone: z.string().min(7, 'Phone number must be valid'),
    event: zodObjectId,
  }),
});

export const updateRegistrantStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'registered', 'invited', 'attended', 'cancelled']),
  }),
  params: z.object({
    registrantId: zodObjectId,
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type UpdateRegistrantStatusInput = z.infer<typeof updateRegistrantStatusSchema>['body'];
