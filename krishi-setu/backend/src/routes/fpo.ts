import express from 'express';
import { authenticate } from '../middleware/auth';
import {
    getFPOMembers,
    addFPOMember,
    updateFPOMember,
    removeFPOMember,
    getFPOMemberAnalytics,
    createPaymentDistribution,
    getPaymentDistributions,
    updatePaymentDistribution,
    autoBalanceContributions
} from '../controllers/fpoController';

const router = express.Router();

// All routes require authentication and FPO role
router.use(authenticate);

// Member management routes
router.get('/members', getFPOMembers);
router.post('/members', addFPOMember);
router.put('/members/:id', updateFPOMember);
router.delete('/members/:id', removeFPOMember);
router.post('/members/balance', autoBalanceContributions);

// Analytics routes
router.get('/analytics', getFPOMemberAnalytics);

// Payment distribution routes
router.post('/payments/distribute', createPaymentDistribution);
router.get('/payments/distributions', getPaymentDistributions);
router.put('/payments/distributions/:id', updatePaymentDistribution);

export default router;


