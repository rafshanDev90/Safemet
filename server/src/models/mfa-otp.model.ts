import mongoose, { Schema, type Document } from 'mongoose';

export type OtpPurpose = 'login';

export interface IMfaOtp extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  otpHash: string;
  purpose: OtpPurpose;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}

const mfaOtpSchema = new Schema<IMfaOtp>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['login'],
      default: 'login',
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

mfaOtpSchema.index({ userId: 1, purpose: 1, isUsed: 1 });

export const MfaOtp = mongoose.model<IMfaOtp>('MfaOtp', mfaOtpSchema);
