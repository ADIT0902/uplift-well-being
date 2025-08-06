import { Router } from 'express';
import { aiChat } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/chat', authenticate, aiChat);

export default router;