import bcrypt from "bcryptjs";
import Admin, { IAdmin } from "../models/adminModel";
import { AppError } from "../errors/appError";

const registerAdmin = async (
  email: string,
  username: string,
  password: string
): Promise<IAdmin> => {
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) throw new AppError('Email already in use', 400);

  const hashedPassword = await bcrypt.hash(password, 12);
  //console.log('Hashed password during registration:', hashedPassword);

  const admin = new Admin({
    email,
    username,
    password: hashedPassword,
  });

  return await admin.save();
};


const loginAdmin = async (
  email: string,
  password: string
): Promise<IAdmin> => {
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin) throw new AppError('Invalid email', 401);

  console.log('Entered password:', password);
  // console.log('Stored hash:', admin.password);

  const isMatch = await admin.comparePassword(password);
  console.log('Stored hash:', admin.password);
  console.log('Password match?', isMatch);
  if (!isMatch) throw new AppError('Invalid password', 401);

  
  return admin;
};


const getAllAdmins = async (): Promise<IAdmin[]> => {
  return await Admin.find().select('-password');
};

export const AdminService = {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
};
