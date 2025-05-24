import express from 'express';
import { updateMedia, getMedia } from '../controllers/media.controller';
import { adminAuth } from '../middleware/auth.middleware';

const router = express.Router();

// Update media URL (admin only)
router.post('/update', adminAuth, updateMedia);

// Get media (public)
router.get('/banner', getMedia);

export default router; 