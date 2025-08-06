import { Router } from 'express';
import { createWellnessGoal, getWellnessGoals, updateWellnessGoal, deleteWellnessGoal } from '../controllers/goalsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createWellnessGoal);
router.get('/', getWellnessGoals);
router.put('/:id', updateWellnessGoal);
router.delete('/:id', deleteWellnessGoal);

export default router;