import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/appError';
import EventModel, { IEvent } from '../models/eventModel';
import { AuthenticatedRequest } from './authMiddleware';

// Validate required event body
export const validateEventBody = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { title, startDate, endDate, venue } = req.body;
  if (!title || !startDate || !endDate || !venue) {
    return next(new AppError('Title, startDate, endDate, and venue are required', 400));
  }
  next();
};

// Ensure only creator (admin) can update/delete
export const verifyEventOwner = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const event = await EventModel.findById(req.params.id);
  if (!event || event.isDeleted) {
    return next(new AppError('Event not found', 404));
  }

  const adminId = req.admin?._id?.toString();
  if (!adminId || event.createdBy.toString() !== adminId) {
    return next(new AppError('You are not authorized for this action', 403));
  }

  next();
};
