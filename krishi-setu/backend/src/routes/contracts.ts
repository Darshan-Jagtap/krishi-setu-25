import express from 'express';
import { authenticate } from '../middleware/auth';
import {
    updateOrderContract,
    createSmartContract,
    getOrderContract,
    finalizeDelivery,
    calculatePriceAdjustment,
    simulateIoTMeasurement,
    getContractById,
    getContractByHash
} from '../controllers/contractController';

const router = express.Router();

// Create a smart contract for an order
router.post('/orders/:orderId/create', authenticate, createSmartContract);

// Update order with contract details (legacy)
router.post('/orders/:orderId/update', authenticate, updateOrderContract);

// Get contract details for an order
router.get('/orders/:orderId/contract', authenticate, getOrderContract);

// Get contract by contract ID
router.get('/contract/:contractId', getContractById);

// Get contract by blockchain hash
router.get('/hash/:hash', getContractByHash);

// Finalize delivery with IoT quality measurement
router.post('/orders/:orderId/finalize', authenticate, finalizeDelivery);

// Calculate price adjustment
router.post('/orders/calculate-price', calculatePriceAdjustment);

// Simulate IoT measurement (for testing)
router.get('/orders/:orderId/simulate-iot', simulateIoTMeasurement);

export default router;
