import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';


export interface IAdmin extends Document {
  email: string;
  username: string;
  password: string; 
  role: 'admin' | 'superadmin';                      
  comparePassword(enteredPassword: string): Promise<boolean>; 
}

const adminSchema = new Schema<IAdmin>( {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.comparePassword = async function (enteredPassword: string) : Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = model<IAdmin>('Admin', adminSchema);
export default Admin;