import { Schema, model, Document, Types } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description?: string;
  bannerImage?: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  category: 'conference' | 'workshop' | 'seminar' | 'concert' | 'rave';
  capacity?: number;
  registrationType: 'open' | 'invite-only';
  status: 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdBy: Types.ObjectId;
  registrants: Types.ObjectId[];
  invitations: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;

  isEventFull(): boolean;
  updateStatus(currentDate: Date): void;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
    },
    bannerImage: {
      type: String,
    },
    startDate: {
      type: Date,
      required: [true, 'Event start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'Event end date is required'],
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
    },
    category: {
      type: String,
      enum: ['conference', 'workshop', 'seminar', 'webinar', 'meetup'],
      required: true,
    },
    capacity: {
      type: Number,
      default: null,
      min: [1, 'Capacity must be at least 1'],
    },
    registrationType: {
      type: String,
      enum: ['open', 'invite-only'],
      default: 'open',
    },
    status: {
      type: String,
      enum: ['draft', 'upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'draft',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    registrants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Registrant',
      },
    ],
    invitations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Invitation',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


eventSchema.pre('save', function (next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date.'));
  }

  if (this.status === 'draft' && this.startDate > new Date()) {
    this.status = 'upcoming';
  }

  next();
});


eventSchema.methods.isEventFull = function (): boolean {
  return this.capacity ? this.registrants.length >= this.capacity : false;
};

eventSchema.methods.updateStatus = function (currentDate: Date): void {
  if (this.status === 'cancelled') return;

  if (currentDate < this.startDate) {
    this.status = 'upcoming';
  } else if (currentDate >= this.startDate && currentDate <= this.endDate) {
    this.status = 'ongoing';
  } else if (currentDate > this.endDate) {
    this.status = 'completed';
  }
};


eventSchema.virtual('totalRegistrants').get(function () {
  return this.registrants ? this.registrants.length : 0;
});

eventSchema.virtual('isFull').get(function () {
  return this.capacity ? this.registrants.length >= this.capacity : false;
});


eventSchema.index({ startDate: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ createdBy: 1, status: 1 });

const Event = model<IEvent>('Event', eventSchema);
export default Event;
