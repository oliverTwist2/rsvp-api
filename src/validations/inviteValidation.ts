import { z } from 'zod';
import { zodObjectId } from './zodObjectId';

export const sendInvitationSchema = z.object({
    body: z.object({
        event: zodObjectId,
        registrant: zodObjectId,
        deliveryMethod: z.array(z.enum(['email', 'sms'])).nonempty(),
        expiresAt: z.coerce.date().refine((date) => date > new Date(), { message: 'Expiration date must be in the future' }),
    })
});

export const respondToInvitationSchema = z.object({
    body: z.object({
        inviteCode: z.string().min(1, 'Invite code is required'),
        responseStatus: z.enum(['accepted', 'declined']),
    }),
});

export type SendInvitationInput = z.infer<typeof sendInvitationSchema>['body'];
export type RespondToInvitationInput = z.infer<typeof respondToInvitationSchema>['body'];