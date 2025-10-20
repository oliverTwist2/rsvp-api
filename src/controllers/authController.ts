import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/authService';
import { generateToken } from '../utils/generateToken';
import { AppError } from '../errors/appError';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      throw new AppError('All fields are required', 400);
    }

    const admin = await AdminService.registerAdmin(email, username, password);
    const token = generateToken({ id: admin._id.toString(), email: admin.email });

    res.status(201).json({
      status: 'success',
      message: 'Admin registered successfully',
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          username: admin.username,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const admin = await AdminService.loginAdmin(email, password);
    const id = typeof admin._id === 'string' ? admin._id : admin._id.toString();

    const token = generateToken({ id, email: admin.email });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          username: admin.username,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
