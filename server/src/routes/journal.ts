import { Router } from 'express';
import { createJournalEntry, getJournalEntries, updateJournalEntry, deleteJournalEntry } from '../controllers/journalController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createJournalEntry);
router.get('/', getJournalEntries);
router.put('/:id', updateJournalEntry);
router.delete('/:id', deleteJournalEntry);

export default router;