import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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

export const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);