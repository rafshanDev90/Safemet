import mongoose, { Schema, type Document } from 'mongoose';

export interface IRefreshToken extends Document {
  _id: mongoose.Types.ObjectId;
  tokenHash: string;
  userId: mongoose.Types.ObjectId;
  userAgent: string;
  ip: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userAgent: {
      type: String,
      default: 'unknown',
    },
    ip: {
      type: String,
      default: 'unknown',
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

refreshTokenSchema.index({ userId: 1, isRevoked: 1 });

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
