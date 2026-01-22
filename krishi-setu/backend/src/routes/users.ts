import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Placeholder routes - implement as needed
router.get('/', authenticate, async (req, res) => {
    res.json({ message: 'Get all users' });
});

export default router;
