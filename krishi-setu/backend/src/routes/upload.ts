import express from 'express';
import { uploadImage } from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Upload image endpoint (requires authentication)
router.post('/image', authenticate, upload.single('image'), uploadImage);

export default router;
