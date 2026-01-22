/**
 * Smart Contract Configuration
 * Update these values after deploying the contract
 */

export const CONTRACT_CONFIG = {
    // Update this after deploying the contract
    contractAddress: process.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',

    // Network configuration (default to Sepolia testnet)
    network: {
        chainId: parseInt(process.env.VITE_CHAIN_ID || '11155111'), // Sepolia
        name: process.env.VITE_NETWORK_NAME || 'sepolia',
        rpcUrl: process.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    },

    // Quality grades mapping
    qualityGrades: {
        A: 0,
        B: 1,
        C: 2,
    } as const,

    // Order status mapping
    orderStatus: {
        Created: 0,
        Funded: 1,
        Delivered: 2,
        Completed: 3,
        Disputed: 4,
        Cancelled: 5,
    } as const,
};

export type QualityGrade = keyof typeof CONTRACT_CONFIG.qualityGrades;
export type OrderStatus = keyof typeof CONTRACT_CONFIG.orderStatus;

// Contract ABI (Application Binary Interface)
export const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "string", "name": "orderId", "type": "string" },
            { "indexed": false, "internalType": "uint256", "name": "refundAmount", "type": "uint256" }
        ],
        "name": "OrderCancelled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "string", "name": "orderId", "type": "string" },
            { "indexed": false, "internalType": "uint256", "name": "sellerPaid", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "buyerRefund", "type": "uint256" }
        ],
        "name": "OrderCompleted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "string", "name": "orderId", "type": "string" },
            { "indexed": true, "internalType": "address", "name": "seller", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "totalAmount", "type": "uint256" }
        ],
        "name": "OrderCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "string", "name": "orderId", "type": "string" },
            { "indexed": false, "internalType": "enum QualityEscrow.QualityGrade", "name": "measuredGrade", "type": "uint8" },
            { "indexed": false, "internalType": "uint256", "name": "finalAmount", "type": "uint256" }
        ],
        "name": "OrderDelivered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "string", "name": "orderId", "type": "string" }
        ],
        "name": "OrderDisputed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "string", "name": "orderId", "type": "string" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "OrderFunded",
        "type": "event"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "orderId", "type": "string" }
        ],
        "name": "cancelOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "orderId", "type": "string" },
            { "internalType": "address payable", "name": "seller", "type": "address" },
            { "internalType": "address payable", "name": "buyer", "type": "address" },
            { "internalType": "uint256", "name": "quantity", "type": "uint256" },
            { "internalType": "enum QualityEscrow.QualityGrade", "name": "agreedQualityGrade", "type": "uint8" },
            { "internalType": "uint256", "name": "basePrice", "type": "uint256" }
        ],
        "name": "createOrder",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "orderId", "type": "string" }
        ],
        "name": "disputeOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "orderId", "type": "string" },
            { "internalType": "enum QualityEscrow.QualityGrade", "name": "measuredQualityGrade", "type": "uint8" }
        ],
        "name": "finalizeDelivery",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBalance",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "buyer", "type": "address" }
        ],
        "name": "getBuyerOrders",
        "outputs": [
            { "internalType": "string[]", "name": "", "type": "string[]" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "orderId", "type": "string" }
        ],
        "name": "getOrder",
        "outputs": [
            { "internalType": "address", "name": "seller", "type": "address" },
            { "internalType": "address", "name": "buyer", "type": "address" },
            { "internalType": "uint256", "name": "quantity", "type": "uint256" },
            { "internalType": "enum QualityEscrow.QualityGrade", "name": "agreedQualityGrade", "type": "uint8" },
            { "internalType": "uint256", "name": "basePrice", "type": "uint256" },
            { "internalType": "uint256", "name": "totalAmount", "type": "uint256" },
            { "internalType": "enum QualityEscrow.OrderStatus", "name": "status", "type": "uint8" },
            { "internalType": "enum QualityEscrow.QualityGrade", "name": "measuredQualityGrade", "type": "uint8" },
            { "internalType": "uint256", "name": "finalAmount", "type": "uint256" },
            { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
            { "internalType": "uint256", "name": "deliveredAt", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "seller", "type": "address" }
        ],
        "name": "getSellerOrders",
        "outputs": [
            { "internalType": "string[]", "name": "", "type": "string[]" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "orderId", "type": "string" },
            { "internalType": "uint256", "name": "sellerAmount", "type": "uint256" },
            { "internalType": "uint256", "name": "buyerAmount", "type": "uint256" }
        ],
        "name": "resolveDispute",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const;
