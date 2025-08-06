import { Router } from 'express';
import { getCrisisResources, createCrisisResource } from '../controllers/crisisController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getCrisisResources);
router.post('/', authenticate, createCrisisResource);

export default router;