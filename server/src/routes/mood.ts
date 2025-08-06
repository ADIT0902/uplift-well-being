import { Router } from 'express';
import { createMoodEntry, getMoodEntries, updateMoodEntry, deleteMoodEntry } from '../controllers/moodController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createMoodEntry);
router.get('/', getMoodEntries);
router.put('/:id', updateMoodEntry);
router.delete('/:id', deleteMoodEntry);

export default router;