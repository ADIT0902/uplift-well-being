import { Response } from 'express';
import { JournalEntry } from '../models/JournalEntry';
import { AuthRequest } from '../middleware/auth';

export const createJournalEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, moodRating, isPrivate } = req.body;
    const userId = req.user!._id;

    const journalEntry = new JournalEntry({
      userId,
      title,
      content,
      moodRating,
      isPrivate: isPrivate !== undefined ? isPrivate : true
    });

    await journalEntry.save();

    res.status(201).json({
      message: 'Journal entry created successfully',
      journalEntry
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getJournalEntries = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { limit = 10, page = 1 } = req.query;

    const journalEntries = await JournalEntry.find({ userId })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json(journalEntries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateJournalEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, moodRating, isPrivate } = req.body;
    const userId = req.user!._id;

    const journalEntry = await JournalEntry.findOneAndUpdate(
      { _id: id, userId },
      { title, content, moodRating, isPrivate },
      { new: true }
    );

    if (!journalEntry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json({
      message: 'Journal entry updated successfully',
      journalEntry
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteJournalEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const journalEntry = await JournalEntry.findOneAndDelete({ _id: id, userId });

    if (!journalEntry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};