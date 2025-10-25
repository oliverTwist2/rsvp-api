import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI
const uri = MONGO_URI || process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI is not defined');
  process.exit(1);
}

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

