import mongoose, { Schema } from 'mongoose';

const mfaOtpSchema = new Schema(
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

export const MfaOtp = mongoose.model('MfaOtp', mfaOtpSchema);