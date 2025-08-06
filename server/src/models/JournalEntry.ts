import mongoose, { Document, Schema } from 'mongoose';

export interface IJournalEntry extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  moodRating?: number;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const journalEntrySchema = new Schema<IJournalEntry>({
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
  content: {
    type: String,
    required: true
  },
  moodRating: {
    type: Number,
    min: 1,
    max: 5
  },
  isPrivate: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const JournalEntry = mongoose.model<IJournalEntry>('JournalEntry', journalEntrySchema);