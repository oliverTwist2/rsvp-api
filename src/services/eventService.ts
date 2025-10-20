import Event, {IEvent} from "../models/eventModel";
import { AppError } from "../errors/appError";


const createEvent = async (
  title: string,
  description: string,
  startDate: Date,
  endDate: Date,
  createdBy: string
): Promise<IEvent> => {
  if (new Date(endDate) < new Date(startDate)) {
    throw new AppError('End date cannot be earlier than start date', 400);
  }

  const event = new Event({
    title,
    description,
    startDate,
    endDate,
    createdBy,
  });

  return await event.save();
};



const updateEvent = async (
eventId: string, updates: Partial<IEvent>, adminId: string | undefined): Promise<IEvent | null> => {
  const event = await Event.findById(eventId);
  if (!event) throw new AppError('Event not found', 404);

  if (new Date() > new Date(event.endDate)) {
    throw new AppError('Cannot update event after deadline', 400);
  }

  Object.assign(event, updates);
  return await event.save();
};


const deleteEvent = async (eventId: string, adminId: string | undefined): Promise<void> => {
  const event = await Event.findById(eventId);
  if (!event) throw new AppError('Event not found', 404);

  if (new Date() > new Date(event.endDate)) {
    throw new AppError('Cannot delete event after deadline', 400);
  }

  event.isDeleted = true;
  await event.save();
};


const getActiveEvents = async (): Promise<IEvent[]> => {
  return await Event.find({ isDeleted: false });
};

export const EventService = {
  createEvent,
  updateEvent,
  deleteEvent,
  getActiveEvents,
};
