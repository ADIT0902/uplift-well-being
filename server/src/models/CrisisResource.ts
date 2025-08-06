import mongoose, { Document, Schema } from 'mongoose';

export interface ICrisisResource extends Document {
  title: string;
  description: string;
  phoneNumber?: string;
  websiteUrl?: string;
  country: string;
  isActive: boolean;
  createdAt: Date;
}

const crisisResourceSchema = new Schema<ICrisisResource>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String
  },
  websiteUrl: {
    type: String
  },
  country: {
    type: String,
    required: true,
    default: 'US'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const CrisisResource = mongoose.model<ICrisisResource>('CrisisResource', crisisResourceSchema);