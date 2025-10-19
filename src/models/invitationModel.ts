import { Schema, model, Document, Types } from 'mongoose';

export interface IInvitation extends Document {
  event: Types.ObjectId;
  registrant: Types.ObjectId;
  inviteCode: string;
  sentAt: Date;
  deliveryStatus: 'pending' | 'sent' | 'failed';
  deliveryMethod: ('email' | 'sms')[];
  responseStatus: 'pending' | 'accepted' | 'declined';
  expiresAt: Date;
}

const invitationSchema = new Schema<IInvitation>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    registrant: {
      type: Schema.Types.ObjectId,
      ref: 'Registrant',
      required: true,
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    deliveryStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
    deliveryMethod: [
      {
        type: String,
        enum: ['email', 'sms'],
        default: 'email',
      },
    ],
    responseStatus: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


invitationSchema.index({ event: 1, registrant: 1 }, { unique: true });
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-delete expired invites


invitationSchema.virtual('registrantDetails', {
  ref: 'Registrant',
  localField: 'registrant',
  foreignField: '_id',
  justOne: true,
});

invitationSchema.virtual('eventDetails', {
  ref: 'Event',
  localField: 'event',
  foreignField: '_id',
  justOne: true,
});

const Invitation = model<IInvitation>('Invitation', invitationSchema);
export default Invitation;
