import mongoose, { Document, Schema } from 'mongoose';

export interface IWellnessGoal extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  targetFrequency: number;
  currentStreak: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const wellnessGoalSchema = new Schema<IWellnessGoal>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  targetFrequency: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  currentStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const WellnessGoal = mongoose.model<IWellnessGoal>('WellnessGoal', wellnessGoalSchema);