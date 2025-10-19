import { z } from 'zod';
import { zodObjectId } from './zodObjectId';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Event title is required'),
    description: z.string().optional(),
    bannerImage: z.string().url('Invalid URL').optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    venue: z.string().min(3, 'Venue is required'),
    category: z.enum(['conference', 'workshop', 'seminar', 'webinar', 'meetup']),
    capacity: z.number().int().positive().optional(),
    registrationType: z.enum(['open', 'invite-only']).default('open'),
    createdBy: zodObjectId,
  }),
}).refine(
  (data) => data.body.endDate > data.body.startDate,
  { message: 'End date must be after start date' }
);

export const updateEventSchema = z.object({
  body: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      bannerImage: z.string().url().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      venue: z.string().optional(),
      category: z.enum(['conference', 'workshop', 'seminar', 'webinar', 'meetup']).optional(),
      capacity: z.number().positive().optional(),
      registrationType: z.enum(['open', 'invite-only']).optional(),
      status: z.enum(['draft', 'upcoming', 'ongoing', 'completed', 'cancelled']).optional(),
    })
    .partial(),
  params: z.object({
    eventId: zodObjectId,
  }),
});

export type CreateEventInput = z.infer<typeof createEventSchema>['body'];
export type UpdateEventInput = z.infer<typeof updateEventSchema>['body'];
