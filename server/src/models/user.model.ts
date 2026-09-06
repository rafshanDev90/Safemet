import mongoose, { Schema, type Document } from 'mongoose';

export type UserRole = 'super_admin' | 'editor' | 'support_staff';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  mfaEnabled: boolean;
  lastLoginAt: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    role: {
      type: String,
      enum: ['super_admin', 'editor', 'support_staff'],
      default: 'support_staff',
      required: true,
    },
    mfaEnabled: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, isDeleted: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
