import { NextFunction, Request, Response } from 'express';
import { EventService } from '../services/eventService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';


export const createEvent = async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.admin?.id;

    const { title, description, date, location } = req.body;

    const event = await EventService.createEvent(
      title,
      description,
      date,
      location,
      adminId as string
    );

    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      data: event,
    });
  }

export const getAllEvents = async (req: Request, res: Response) => {
  const events = await EventService.getActiveEvents();
  res.status(200).json({
    status: 'success',
    results: events.length,
    data: events,
  });
};

export const updateEvent = async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.admin?.id;
    const event = await EventService.updateEvent(req.params.id, req.body, adminId);
    res.status(200).json({
      status: 'success',
      message: 'Event updated successfully',
      data: event,
    });
  }

export const deleteEvent = async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.admin?._id;
    await EventService.deleteEvent(req.params.id, adminId);
    res.status(204).json({
      status: 'success',
      message: 'Event deleted successfully',
    });
  }

