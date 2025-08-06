import { Response } from 'express';
import { MoodEntry } from '../models/MoodEntry';
import { AuthRequest } from '../middleware/auth';

export const createMoodEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { moodLevel, emotions, notes } = req.body;
    const userId = req.user!._id;

    const moodEntry = new MoodEntry({
      userId,
      moodLevel,
      emotions: emotions || [],
      notes
    });

    await moodEntry.save();

    res.status(201).json({
      message: 'Mood entry created successfully',
      moodEntry
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMoodEntries = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { limit = 10, page = 1 } = req.query;

    const moodEntries = await MoodEntry.find({ userId })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json(moodEntries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMoodEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { moodLevel, emotions, notes } = req.body;
    const userId = req.user!._id;

    const moodEntry = await MoodEntry.findOneAndUpdate(
      { _id: id, userId },
      { moodLevel, emotions, notes },
      { new: true }
    );

    if (!moodEntry) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    res.json({
      message: 'Mood entry updated successfully',
      moodEntry
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMoodEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const moodEntry = await MoodEntry.findOneAndDelete({ _id: id, userId });

    if (!moodEntry) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    res.json({ message: 'Mood entry deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};