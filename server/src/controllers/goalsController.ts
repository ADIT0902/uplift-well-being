import { Response } from 'express';
import { WellnessGoal } from '../models/WellnessGoal';
import { AuthRequest } from '../middleware/auth';

export const createWellnessGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, targetFrequency } = req.body;
    const userId = req.user!._id;

    const goal = new WellnessGoal({
      userId,
      title,
      description,
      targetFrequency: targetFrequency || 1
    });

    await goal.save();

    res.status(201).json({
      message: 'Wellness goal created successfully',
      goal
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getWellnessGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    const goals = await WellnessGoal.find({ userId })
      .sort({ createdAt: -1 });

    res.json(goals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateWellnessGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, targetFrequency, currentStreak, isCompleted } = req.body;
    const userId = req.user!._id;

    const goal = await WellnessGoal.findOneAndUpdate(
      { _id: id, userId },
      { title, description, targetFrequency, currentStreak, isCompleted },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ error: 'Wellness goal not found' });
    }

    res.json({
      message: 'Wellness goal updated successfully',
      goal
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteWellnessGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const goal = await WellnessGoal.findOneAndDelete({ _id: id, userId });

    if (!goal) {
      return res.status(404).json({ error: 'Wellness goal not found' });
    }

    res.json({ message: 'Wellness goal deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};