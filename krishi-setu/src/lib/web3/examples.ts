/**
 * Example: How to integrate Web3 smart contract into your order flow
 * 
 * This file shows how to modify the handlePlaceOrder function to create
 * a real blockchain transaction when using blockchain payment method.
 */

import { web3Service } from '@/lib/web3/web3Service';
import type { QualityGrade } from '@/lib/web3/contractConfig';

/**
 * Example 1: Create order with blockchain escrow
 */
export async function createOrderWithBlockchain(
    orderId: string,
    sellerAddress: string,
    quantity: number,
    agreedQualityGrade: QualityGrade,
    totalPriceInRupees: number,
    paymentMethod: string
) {
    // Only use blockchain if payment method is 'blockchain'
    if (paymentMethod !== 'blockchain') {
        return {
            useBlockchain: false,
            contractTxHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock hash
            smartContractId: `SC${Date.now().toString().slice(-8)}`,
        };
    }

    try {
        // Initialize Web3 connection
        await web3Service.initialize();

        // Convert INR to ETH (you'll need a price oracle for real conversion)
        // For testing, use a fixed rate: 1 ETH = 200,000 INR
        const ethPrice = 200000; // INR per ETH
        const priceInEth = (totalPriceInRupees / ethPrice).toFixed(6);

        // Create order on blockchain
        const result = await web3Service.createOrder(
            orderId,
            sellerAddress,
            quantity,
            agreedQualityGrade,
            priceInEth
        );

        return {
            useBlockchain: true,
            contractTxHash: result.txHash,
            smartContractId: `SC-${orderId}`,
            walletAddress: await web3Service.getWalletAddress(),
        };
    } catch (error: any) {
        console.error('Blockchain error:', error);

        // Fallback to mock mode if blockchain fails
        return {
            useBlockchain: false,
            contractTxHash: `0x${Math.random().toString(16).substr(2, 64)}`,
            smartContractId: `SC${Date.now().toString().slice(-8)}`,
            error: error.message,
        };
    }
}

/**
 * Example 2: Modified handlePlaceOrder with Web3 integration
 */
export async function handlePlaceOrderWithWeb3(
    orderData: {
        orderId: string;
        product: any;
        quantity: number;
        agreedQualityGrade: QualityGrade;
        totalPrice: number;
        deliveryInfo: any;
        paymentMethod: string;
        orderNotes: string;
        user: any;
    }
) {
    const {
        orderId,
        product,
        quantity,
        agreedQualityGrade,
        totalPrice,
        deliveryInfo,
        paymentMethod,
        orderNotes,
        user,
    } = orderData;

    // Step 1: Create blockchain transaction (if using blockchain payment)
    const blockchainResult = await createOrderWithBlockchain(
        orderId,
        product.sellerWalletAddress || '0x0000000000000000000000000000000000000000',
        quantity,
        agreedQualityGrade,
        totalPrice,
        paymentMethod
    );

    // Step 2: Save order to database
    const orderPayload = {
        order_id: orderId,
        product_id: product.id || null,
        seller_id: product.supplierId || user?.id,
        quantity: quantity,
        total_price: totalPrice,
        status: 'processing',
        delivery_info: deliveryInfo,
        payment_method: paymentMethod,
        order_notes: `${orderNotes}\nAgreed Quality Grade: ${agreedQualityGrade}`,
        smart_contract_id: blockchainResult.smartContractId,
        blockchain_hash: blockchainResult.contractTxHash,
        tracking_id: `TRK${Date.now().toString().slice(-8)}`,
        product_name: product.name,
        supplier_name: product.supplier,
        delivery_time: product.deliveryTime,
    };

    // Save to database via API
    const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
        throw new Error('Failed to create order');
    }

    const savedOrder = await response.json();

    // Step 3: Update order with contract details (if blockchain was used)
    if (blockchainResult.useBlockchain && blockchainResult.walletAddress) {
        await fetch(`http://localhost:3000/api/contracts/orders/${orderId}/contract`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                contractTxHash: blockchainResult.contractTxHash,
                walletAddress: blockchainResult.walletAddress,
                agreedQualityGrade: agreedQualityGrade,
            }),
        });
    }

    return {
        success: true,
        order: savedOrder,
        blockchain: blockchainResult,
    };
}

/**
 * Example 3: Finalize delivery with IoT quality measurement
 */
export async function finalizeDeliveryWithIoT(
    orderId: string,
    iotData: {
        moisture: number;
        temperature: number;
        purity: number;
        contamination: number;
    }
) {
    // Step 1: Determine quality grade from IoT data
    let measuredQualityGrade: QualityGrade;

    if (iotData.purity >= 98 && iotData.contamination < 1) {
        measuredQualityGrade = 'A';
    } else if (iotData.purity >= 95 && iotData.contamination < 3) {
        measuredQualityGrade = 'B';
    } else {
        measuredQualityGrade = 'C';
    }

    // Step 2: Call backend to finalize delivery
    const response = await fetch(
        `http://localhost:3000/api/contracts/orders/${orderId}/finalize`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                measuredQualityGrade,
                iotData,
            }),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to finalize delivery');
    }

    const result = await response.json();

    // Step 3: Finalize on blockchain (if using blockchain)
    try {
        await web3Service.initialize();
        const blockchainResult = await web3Service.finalizeDelivery(
            orderId,
            measuredQualityGrade
        );

        return {
            ...result,
            blockchain: blockchainResult,
        };
    } catch (error) {
        console.error('Blockchain finalization error:', error);
        return result; // Return backend result even if blockchain fails
    }
}

/**
 * Example 4: Get order details with contract information
 */
export async function getOrderWithContractDetails(orderId: string) {
    const response = await fetch(
        `http://localhost:3000/api/contracts/orders/${orderId}/contract`,
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch order details');
    }

    const data = await response.json();

    // If blockchain is being used, also fetch from blockchain
    try {
        await web3Service.initialize();
        const blockchainOrder = await web3Service.getOrderDetails(orderId);

        return {
            ...data,
            blockchainData: blockchainOrder,
        };
    } catch (error) {
        console.error('Blockchain fetch error:', error);
        return data; // Return backend data even if blockchain fails
    }
}

/**
 * Example 5: Calculate price adjustment preview
 */
export async function calculatePriceAdjustment(
    orderId: string,
    agreedGrade: QualityGrade,
    measuredGrade: QualityGrade
) {
    const response = await fetch(
        'http://localhost:3000/api/contracts/orders/calculate-price',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId,
                measuredQualityGrade: measuredGrade,
            }),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to calculate price');
    }

    return await response.json();
}

/**
 * Example 6: Listen to blockchain events
 */
export function setupBlockchainEventListeners() {
    try {
        // Listen for order created events
        web3Service.onOrderCreated((orderId, seller, buyer, totalAmount) => {
            console.log('Order created on blockchain:', {
                orderId,
                seller,
                buyer,
                totalAmount,
            });

            // Update UI or trigger notifications
        });

        // Listen for order delivered events
        web3Service.onOrderDelivered((orderId, measuredGrade, finalAmount) => {
            console.log('Order delivered on blockchain:', {
                orderId,
                measuredGrade,
                finalAmount,
            });

            // Update UI or trigger notifications
        });

        // Listen for order completed events
        web3Service.onOrderCompleted((orderId, sellerPaid, buyerRefund) => {
            console.log('Order completed on blockchain:', {
                orderId,
                sellerPaid,
                buyerRefund,
            });

            // Update UI or trigger notifications
        });
    } catch (error) {
        console.error('Event listener setup error:', error);
    }
}

/**
 * Example 7: Cleanup event listeners
 */
export function cleanupBlockchainEventListeners() {
    web3Service.removeAllListeners();
}

// Export all examples
export default {
    createOrderWithBlockchain,
    handlePlaceOrderWithWeb3,
    finalizeDeliveryWithIoT,
    getOrderWithContractDetails,
    calculatePriceAdjustment,
    setupBlockchainEventListeners,
    cleanupBlockchainEventListeners,
};
