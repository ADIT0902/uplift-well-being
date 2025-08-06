import mongoose, { Document, Schema } from 'mongoose';

export interface IMeditationSession extends Document {
  userId: mongoose.Types.ObjectId;
  sessionType: string;
  durationMinutes: number;
  completed: boolean;
  notes?: string;
  createdAt: Date;
}

const meditationSessionSchema = new Schema<IMeditationSession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionType: {
    type: String,
    required: true,
    enum: ['mindfulness', 'breathing', 'body-scan', 'loving-kindness']
  },
  durationMinutes: {
    type: Number,
    required: true,
    min: 1
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

export const MeditationSession = mongoose.model<IMeditationSession>('MeditationSession', meditationSessionSchema);