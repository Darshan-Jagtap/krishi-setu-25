import express from 'express';
import { getFarmerStats, getBuyerStats } from '../controllers/statsController';
import { getProcessorStats } from '../controllers/processorStatsController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Farmer statistics
router.get('/farmer', authenticate, getFarmerStats);

// Buyer statistics
router.get('/buyer', authenticate, getBuyerStats);

// Processor statistics
router.get('/processor', authenticate, getProcessorStats);

export default router;
