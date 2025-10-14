import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) return next(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error(err);
  const statusCode = 500;
  const payload: any = { status: 'error', message: 'Internal Server Error' };
  if (process.env.NODE_ENV === 'development') {
    payload.original = err?.message;
    payload.stack = err?.stack;
  }
  res.status(statusCode).json(payload);
}


export function notFound(req: Request, res: Response, next: NextFunction) {
  next(new AppError(`Not Found - ${req.originalUrl}`, 404));
}