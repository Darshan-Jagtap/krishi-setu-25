import { ethers } from 'ethers';
import { CONTRACT_CONFIG, CONTRACT_ABI, QualityGrade, OrderStatus } from './contractConfig';

export interface OrderData {
    orderId: string;
    seller: string;
    buyer: string;
    quantity: number;
    agreedQualityGrade: QualityGrade;
    basePrice: string; // in ETH
    totalAmount: string;
    status: OrderStatus;
    measuredQualityGrade?: QualityGrade;
    finalAmount?: string;
    createdAt?: number;
    deliveredAt?: number;
}

export class Web3Service {
    private provider: ethers.BrowserProvider | null = null;
    private signer: ethers.Signer | null = null;
    private contract: ethers.Contract | null = null;
    private isInitialized = false;

    /**
     * Initialize Web3 connection
     */
    async initialize(): Promise<boolean> {
        try {
            // Check if MetaMask is installed
            if (typeof window.ethereum === 'undefined') {
                throw new Error('MetaMask is not installed. Please install MetaMask to use blockchain features.');
            }

            // Create provider
            this.provider = new ethers.BrowserProvider(window.ethereum);

            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Get signer
            this.signer = await this.provider.getSigner();

            // Create contract instance
            this.contract = new ethers.Contract(
                CONTRACT_CONFIG.contractAddress,
                CONTRACT_ABI,
                this.signer
            );

            // Check if we're on the correct network
            const network = await this.provider.getNetwork();
            if (Number(network.chainId) !== CONTRACT_CONFIG.network.chainId) {
                await this.switchNetwork();
            }

            this.isInitialized = true;
            return true;
        } catch (error: any) {
            console.error('Web3 initialization error:', error);
            throw new Error(error.message || 'Failed to initialize Web3');
        }
    }

    /**
     * Switch to the correct network
     */
    async switchNetwork(): Promise<void> {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${CONTRACT_CONFIG.network.chainId.toString(16)}` }],
            });
        } catch (error: any) {
            // If the network doesn't exist, add it
            if (error.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: `0x${CONTRACT_CONFIG.network.chainId.toString(16)}`,
                        chainName: CONTRACT_CONFIG.network.name,
                        rpcUrls: [CONTRACT_CONFIG.network.rpcUrl],
                    }],
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * Get current connected wallet address
     */
    async getWalletAddress(): Promise<string> {
        if (!this.signer) {
            await this.initialize();
        }
        return await this.signer!.getAddress();
    }

    /**
     * Get wallet balance in ETH
     */
    async getBalance(): Promise<string> {
        if (!this.provider || !this.signer) {
            await this.initialize();
        }
        const address = await this.signer!.getAddress();
        const balance = await this.provider!.getBalance(address);
        return ethers.formatEther(balance);
    }

    /**
     * Create a new order on the blockchain
     */
    async createOrder(
        orderId: string,
        sellerAddress: string,
        quantity: number,
        agreedQualityGrade: QualityGrade,
        basePriceInEth: string
    ): Promise<{ txHash: string; orderId: string }> {
        if (!this.contract || !this.signer) {
            await this.initialize();
        }

        try {
            const buyerAddress = await this.signer!.getAddress();

            // Convert price to wei
            const basePriceWei = ethers.parseEther(basePriceInEth);
            const totalAmountWei = basePriceWei * BigInt(quantity);

            // Get quality grade enum value
            const gradeValue = CONTRACT_CONFIG.qualityGrades[agreedQualityGrade];

            // Create order transaction
            const tx = await this.contract!.createOrder(
                orderId,
                sellerAddress,
                buyerAddress,
                quantity,
                gradeValue,
                basePriceWei,
                { value: totalAmountWei }
            );

            // Wait for transaction confirmation
            const receipt = await tx.wait();

            return {
                txHash: receipt.hash,
                orderId: orderId,
            };
        } catch (error: any) {
            console.error('Create order error:', error);
            throw new Error(error.message || 'Failed to create order on blockchain');
        }
    }

    /**
     * Finalize delivery with quality measurement
     */
    async finalizeDelivery(
        orderId: string,
        measuredQualityGrade: QualityGrade
    ): Promise<{ txHash: string; finalAmount: string }> {
        if (!this.contract) {
            await this.initialize();
        }

        try {
            const gradeValue = CONTRACT_CONFIG.qualityGrades[measuredQualityGrade];

            // Finalize delivery transaction
            const tx = await this.contract!.finalizeDelivery(orderId, gradeValue);
            const receipt = await tx.wait();

            // Get order details to retrieve final amount
            const orderDetails = await this.getOrderDetails(orderId);

            return {
                txHash: receipt.hash,
                finalAmount: orderDetails.finalAmount || '0',
            };
        } catch (error: any) {
            console.error('Finalize delivery error:', error);
            throw new Error(error.message || 'Failed to finalize delivery');
        }
    }

    /**
     * Cancel an order
     */
    async cancelOrder(orderId: string): Promise<string> {
        if (!this.contract) {
            await this.initialize();
        }

        try {
            const tx = await this.contract!.cancelOrder(orderId);
            const receipt = await tx.wait();
            return receipt.hash;
        } catch (error: any) {
            console.error('Cancel order error:', error);
            throw new Error(error.message || 'Failed to cancel order');
        }
    }

    /**
     * Dispute an order
     */
    async disputeOrder(orderId: string): Promise<string> {
        if (!this.contract) {
            await this.initialize();
        }

        try {
            const tx = await this.contract!.disputeOrder(orderId);
            const receipt = await tx.wait();
            return receipt.hash;
        } catch (error: any) {
            console.error('Dispute order error:', error);
            throw new Error(error.message || 'Failed to dispute order');
        }
    }

    /**
     * Get order details from blockchain
     */
    async getOrderDetails(orderId: string): Promise<OrderData> {
        if (!this.contract) {
            await this.initialize();
        }

        try {
            const order = await this.contract!.getOrder(orderId);

            // Map quality grade enum to string
            const gradeMap: { [key: number]: QualityGrade } = { 0: 'A', 1: 'B', 2: 'C' };
            const statusMap: { [key: number]: OrderStatus } = {
                0: 'Created',
                1: 'Funded',
                2: 'Delivered',
                3: 'Completed',
                4: 'Disputed',
                5: 'Cancelled',
            };

            return {
                orderId,
                seller: order.seller,
                buyer: order.buyer,
                quantity: Number(order.quantity),
                agreedQualityGrade: gradeMap[order.agreedQualityGrade],
                basePrice: ethers.formatEther(order.basePrice),
                totalAmount: ethers.formatEther(order.totalAmount),
                status: statusMap[order.status],
                measuredQualityGrade: gradeMap[order.measuredQualityGrade],
                finalAmount: order.finalAmount > 0 ? ethers.formatEther(order.finalAmount) : undefined,
                createdAt: Number(order.createdAt),
                deliveredAt: Number(order.deliveredAt) > 0 ? Number(order.deliveredAt) : undefined,
            };
        } catch (error: any) {
            console.error('Get order details error:', error);
            throw new Error(error.message || 'Failed to get order details');
        }
    }

    /**
     * Get buyer's orders
     */
    async getBuyerOrders(buyerAddress: string): Promise<string[]> {
        if (!this.contract) {
            await this.initialize();
        }

        try {
            return await this.contract!.getBuyerOrders(buyerAddress);
        } catch (error: any) {
            console.error('Get buyer orders error:', error);
            throw new Error(error.message || 'Failed to get buyer orders');
        }
    }

    /**
     * Get seller's orders
     */
    async getSellerOrders(sellerAddress: string): Promise<string[]> {
        if (!this.contract) {
            await this.initialize();
        }

        try {
            return await this.contract!.getSellerOrders(sellerAddress);
        } catch (error: any) {
            console.error('Get seller orders error:', error);
            throw new Error(error.message || 'Failed to get seller orders');
        }
    }

    /**
     * Listen to contract events
     */
    onOrderCreated(callback: (orderId: string, seller: string, buyer: string, totalAmount: string) => void) {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        this.contract.on('OrderCreated', (orderId, seller, buyer, totalAmount) => {
            callback(orderId, seller, buyer, ethers.formatEther(totalAmount));
        });
    }

    onOrderDelivered(callback: (orderId: string, measuredGrade: number, finalAmount: string) => void) {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        this.contract.on('OrderDelivered', (orderId, measuredGrade, finalAmount) => {
            callback(orderId, measuredGrade, ethers.formatEther(finalAmount));
        });
    }

    onOrderCompleted(callback: (orderId: string, sellerPaid: string, buyerRefund: string) => void) {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        this.contract.on('OrderCompleted', (orderId, sellerPaid, buyerRefund) => {
            callback(orderId, ethers.formatEther(sellerPaid), ethers.formatEther(buyerRefund));
        });
    }

    /**
     * Remove all event listeners
     */
    removeAllListeners() {
        if (this.contract) {
            this.contract.removeAllListeners();
        }
    }
}

// Export singleton instance
export const web3Service = new Web3Service();

// Type declarations for window.ethereum
declare global {
    interface Window {
        ethereum?: any;
    }
}
