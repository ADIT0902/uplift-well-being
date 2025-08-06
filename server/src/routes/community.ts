import { Router } from 'express';
import { createCommunityPost, getCommunityPosts, updateCommunityPost, deleteCommunityPost, likeCommunityPost } from '../controllers/communityController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getCommunityPosts);
router.post('/', authenticate, createCommunityPost);
router.put('/:id', authenticate, updateCommunityPost);
router.delete('/:id', authenticate, deleteCommunityPost);
router.post('/:id/like', authenticate, likeCommunityPost);

export default router;