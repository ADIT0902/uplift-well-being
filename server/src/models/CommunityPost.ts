import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunityPost extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const communityPostSchema = new Schema<ICommunityPost>({
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
  category: {
    type: String,
    required: true,
    default: 'general',
    enum: ['general', 'anxiety', 'depression', 'mindfulness', 'self-care', 'success-stories', 'resources']
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  likesCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

export const CommunityPost = mongoose.model<ICommunityPost>('CommunityPost', communityPostSchema);