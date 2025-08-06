import mongoose, { Document, Schema } from 'mongoose';

export interface IMoodEntry extends Document {
  userId: mongoose.Types.ObjectId;
  moodLevel: number;
  emotions: string[];
  notes?: string;
  createdAt: Date;
}

const moodEntrySchema = new Schema<IMoodEntry>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moodLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  emotions: [{
    type: String
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

export const MoodEntry = mongoose.model<IMoodEntry>('MoodEntry', moodEntrySchema);