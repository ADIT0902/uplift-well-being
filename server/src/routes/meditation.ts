import { Router } from 'express';
import { createMeditationSession, getMeditationSessions, updateMeditationSession, deleteMeditationSession } from '../controllers/meditationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createMeditationSession);
router.get('/', getMeditationSessions);
router.put('/:id', updateMeditationSession);
router.delete('/:id', deleteMeditationSession);

export default router;