import { Request, Response } from 'express';
import { CrisisResource } from '../models/CrisisResource';

export const getCrisisResources = async (req: Request, res: Response) => {
  try {
    const resources = await CrisisResource.find({ isActive: true })
      .sort({ country: 1, title: 1 });

    res.json(resources);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createCrisisResource = async (req: Request, res: Response) => {
  try {
    const { title, description, phoneNumber, websiteUrl, country } = req.body;

    const resource = new CrisisResource({
      title,
      description,
      phoneNumber,
      websiteUrl,
      country: country || 'US'
    });

    await resource.save();

    res.status(201).json({
      message: 'Crisis resource created successfully',
      resource
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};