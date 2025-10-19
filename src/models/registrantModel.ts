import { Schema, model, Document, Types } from 'mongoose';

export interface IRegistrant extends Document {
  fullName: string;
  email: string;
  phone: string;
  event: Types.ObjectId;
  status: 'pending' | 'registered' | 'invited' | 'attended' | 'cancelled';
  registeredAt: Date;
}

const registrantSchema = new Schema<IRegistrant>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Invalid email format'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'registered', 'invited', 'attended', 'cancelled'],
      default: 'pending',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


registrantSchema.index({ email: 1, event: 1 }, { unique: true });
registrantSchema.index({ phone: 1, event: 1 }, { unique: true });


registrantSchema.virtual('eventDetails', {
  ref: 'Event',
  localField: 'event',
  foreignField: '_id',
  justOne: true,
});

const Registrant = model<IRegistrant>('Registrant', registrantSchema);
export default Registrant;
