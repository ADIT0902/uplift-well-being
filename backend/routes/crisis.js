import { Router } from 'express';
import { CrisisResource } from '../models/CrisisResource.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const resources = await CrisisResource.find({ isActive: true })
      .sort({ country: 1, title: 1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;