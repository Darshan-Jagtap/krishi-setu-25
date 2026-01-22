import SmartContract, { ISmartContract } from '../models/SmartContract';
import crypto from 'crypto';

// Quality degradation matrix (same as blockchain contract)
const DEGRADATION_MATRIX: { [key: string]: { [key: string]: number } } = {
    'A': { 'A': 100, 'B': 90, 'C': 75 },
    'B': { 'A': 100, 'B': 100, 'C': 85 },
    'C': { 'A': 100, 'B': 100, 'C': 100 }
};

// Reference values for quality calculation
const REFERENCE_VALUES = {
    OC_ref: 20,    // Expected oil content (%)
    M_max: 20,     // Max allowed moisture (%)
    IM_max: 10     // Max allowed impurity (%)
};

// Weights for quality score computation
const WEIGHTS = {
    w1: 0.60,  // Oil content weight
    w2: 0.25,  // Moisture weight
    w3: 0.15   // Impurity weight
};

export class SmartContractService {

    /**
     * Generate a simulated blockchain hash
     */
    private static generateBlockchainHash(): string {
        return '0x' + crypto.randomBytes(32).toString('hex');
    }

    /**
     * Generate a simulated wallet address
     */
    private static generateWalletAddress(): string {
        return '0x' + crypto.randomBytes(20).toString('hex');
    }

    /**
     * Generate a contract ID
     */
    private static generateContractId(orderId: string): string {
        return `SC-${orderId}`;
    }

    /**
     * Generate a simulated block number
     */
    private static generateBlockNumber(): number {
        return Math.floor(Math.random() * 1000000) + 15000000;
    }

    /**
     * Create a new smart contract
     */
    static async createContract(data: {
        order_id: string;
        buyer_id: string;
        seller_id: string;
        product_name: string;
        quantity: number;
        unit?: string;
        agreed_quality_grade: 'A' | 'B' | 'C';
        base_price: number;
        buyer_wallet?: string;
        seller_wallet?: string;
    }): Promise<ISmartContract> {

        const total_amount = data.quantity * data.base_price;
        const contract_id = this.generateContractId(data.order_id);
        const blockchain_hash = this.generateBlockchainHash();
        const transaction_hash = this.generateBlockchainHash();
        const block_number = this.generateBlockNumber();

        const contract = new SmartContract({
            contract_id,
            order_id: data.order_id,
            buyer_id: data.buyer_id,
            seller_id: data.seller_id,
            buyer_wallet: data.buyer_wallet || this.generateWalletAddress(),
            seller_wallet: data.seller_wallet || this.generateWalletAddress(),
            product_name: data.product_name,
            quantity: data.quantity,
            unit: data.unit || 'kg',
            agreed_quality_grade: data.agreed_quality_grade,
            base_price: data.base_price,
            total_amount,
            blockchain_hash,
            transaction_hash,
            block_number,
            status: 'funded',
            payment_status: 'escrow_locked',
            funded_at: new Date(),
            created_at: new Date()
        });

        await contract.save();
        return contract;
    }

    /**
     * Calculate price adjustment based on quality degradation
     */
    static calculatePriceAdjustment(
        agreedGrade: 'A' | 'B' | 'C',
        measuredGrade: 'A' | 'B' | 'C',
        totalAmount: number
    ): {
        finalAmount: number;
        adjustment: number;
        percentage: number;
    } {
        const percentage = DEGRADATION_MATRIX[agreedGrade][measuredGrade];
        const finalAmount = Math.round((totalAmount * percentage) / 100);
        const adjustment = totalAmount - finalAmount;

        return {
            finalAmount,
            adjustment,
            percentage: 100 - percentage
        };
    }

    /**
     * Calculate quality index using weighted formula
     * Q = w1 * (OC / OC_ref) + w2 * (1 - M / M_max) + w3 * (1 - IM / IM_max)
     */
    static calculateQualityIndex(iotData: {
        oil_content?: number;
        moisture?: number;
        impurities?: number;
    }): number {
        const { oil_content = 0, moisture = 0, impurities = 0 } = iotData;
        const { OC_ref, M_max, IM_max } = REFERENCE_VALUES;
        const { w1, w2, w3 } = WEIGHTS;

        const Q = w1 * (oil_content / OC_ref)
            + w2 * (1 - moisture / M_max)
            + w3 * (1 - impurities / IM_max);

        return Math.max(0, Math.min(1, Q)); // Clamp between 0 and 1
    }

    /**
     * Determine quality grade from quality index
     * Grade A: Q >= 0.80
     * Grade B: 0.65 <= Q < 0.80
     * Grade C: Q < 0.65
     */
    static determineQualityGrade(iotData: {
        oil_content?: number;
        moisture?: number;
        impurities?: number;
        purity?: number;
        contamination?: number;
    }): 'A' | 'B' | 'C' {
        const qualityIndex = this.calculateQualityIndex(iotData);

        if (qualityIndex >= 0.80) {
            return 'A';
        } else if (qualityIndex >= 0.65) {
            return 'B';
        } else {
            return 'C';
        }
    }

    /**
     * Finalize delivery with quality measurement
     */
    static async finalizeDelivery(
        contractId: string,
        measuredQualityGrade: 'A' | 'B' | 'C',
        iotData?: {
            oil_content?: number;
            moisture?: number;
            impurities?: number;
            temperature?: number;
            purity?: number;
            contamination?: number;
        }
    ): Promise<ISmartContract> {

        const contract = await SmartContract.findOne({ contract_id: contractId });

        if (!contract) {
            throw new Error('Contract not found');
        }

        if (contract.status !== 'funded') {
            throw new Error('Contract is not in funded status');
        }

        // Calculate price adjustment
        const { finalAmount, adjustment, percentage } = this.calculatePriceAdjustment(
            contract.agreed_quality_grade,
            measuredQualityGrade,
            contract.total_amount
        );

        // Update contract
        contract.measured_quality_grade = measuredQualityGrade;
        contract.final_amount = finalAmount;
        contract.price_adjustment = adjustment;
        contract.adjustment_percentage = percentage;
        contract.status = 'delivered';
        contract.delivered_at = new Date();

        if (iotData) {
            // Calculate quality index
            const qualityIndex = this.calculateQualityIndex(iotData);

            contract.iot_data = {
                ...iotData,
                quality_index: qualityIndex,
                measured_at: new Date()
            };
        }

        await contract.save();

        // Automatically complete the contract
        return await this.completeContract(contractId);
    }

    /**
     * Complete contract and release payment
     */
    static async completeContract(contractId: string): Promise<ISmartContract> {

        const contract = await SmartContract.findOne({ contract_id: contractId });

        if (!contract) {
            throw new Error('Contract not found');
        }

        if (contract.status !== 'delivered') {
            throw new Error('Contract must be delivered before completion');
        }

        contract.status = 'completed';
        contract.payment_status = 'payment_released';
        contract.completed_at = new Date();

        await contract.save();
        return contract;
    }

    /**
     * Cancel contract and refund buyer
     */
    static async cancelContract(
        contractId: string,
        reason?: string
    ): Promise<ISmartContract> {

        const contract = await SmartContract.findOne({ contract_id: contractId });

        if (!contract) {
            throw new Error('Contract not found');
        }

        if (contract.status === 'completed' || contract.status === 'cancelled') {
            throw new Error('Cannot cancel completed or already cancelled contract');
        }

        contract.status = 'cancelled';
        contract.payment_status = 'refunded';
        contract.notes = reason || 'Contract cancelled';

        await contract.save();
        return contract;
    }

    /**
     * Dispute contract
     */
    static async disputeContract(
        contractId: string,
        reason: string
    ): Promise<ISmartContract> {

        const contract = await SmartContract.findOne({ contract_id: contractId });

        if (!contract) {
            throw new Error('Contract not found');
        }

        contract.status = 'disputed';
        contract.payment_status = 'disputed';
        contract.dispute_reason = reason;

        await contract.save();
        return contract;
    }

    /**
     * Get contract by ID
     */
    static async getContract(contractId: string): Promise<ISmartContract | null> {
        return await SmartContract.findOne({ contract_id: contractId })
            .populate('buyer_id', 'full_name email')
            .populate('seller_id', 'full_name email');
    }

    /**
     * Get contract by order ID
     */
    static async getContractByOrderId(orderId: string): Promise<ISmartContract | null> {
        return await SmartContract.findOne({ order_id: orderId })
            .populate('buyer_id', 'full_name email')
            .populate('seller_id', 'full_name email');
    }

    /**
     * Get contract by blockchain hash
     */
    static async getContractByHash(hash: string): Promise<ISmartContract | null> {
        return await SmartContract.findOne({
            $or: [
                { blockchain_hash: hash },
                { transaction_hash: hash }
            ]
        })
            .populate('buyer_id', 'full_name email')
            .populate('seller_id', 'full_name email');
    }

    /**
     * Get buyer's contracts
     */
    static async getBuyerContracts(buyerId: string): Promise<ISmartContract[]> {
        return await SmartContract.find({ buyer_id: buyerId })
            .populate('seller_id', 'full_name email')
            .sort({ created_at: -1 });
    }

    /**
     * Get seller's contracts
     */
    static async getSellerContracts(sellerId: string): Promise<ISmartContract[]> {
        return await SmartContract.find({ seller_id: sellerId })
            .populate('buyer_id', 'full_name email')
            .sort({ created_at: -1 });
    }

    /**
     * Simulate IoT measurement with weighted quality formula
     */
    static simulateIoTMeasurement(agreedGrade: 'A' | 'B' | 'C'): {
        grade: 'A' | 'B' | 'C';
        data: {
            oil_content: number;
            moisture: number;
            impurities: number;
            temperature: number;
            purity: number;
            contamination: number;
            quality_index: number;
        };
    } {
        let oil_content: number;
        let moisture: number;
        let impurities: number;

        // 70% chance of meeting agreed quality, 30% chance of degradation
        const random = Math.random();

        if (agreedGrade === 'A') {
            // Target Q >= 0.80
            if (random < 0.7) {
                oil_content = 18 + Math.random() * 4;  // 18-22%
                moisture = 5 + Math.random() * 5;      // 5-10%
                impurities = 1 + Math.random() * 2;    // 1-3%
            } else {
                // Degraded to B
                oil_content = 15 + Math.random() * 5;  // 15-20%
                moisture = 10 + Math.random() * 5;     // 10-15%
                impurities = 3 + Math.random() * 3;    // 3-6%
            }
        } else if (agreedGrade === 'B') {
            // Target Q = 0.65-0.79
            if (random < 0.7) {
                oil_content = 14 + Math.random() * 6;  // 14-20%
                moisture = 8 + Math.random() * 7;      // 8-15%
                impurities = 2 + Math.random() * 4;    // 2-6%
            } else {
                // Degraded to C
                oil_content = 10 + Math.random() * 6;  // 10-16%
                moisture = 12 + Math.random() * 6;     // 12-18%
                impurities = 4 + Math.random() * 4;    // 4-8%
            }
        } else {
            // Grade C: Q < 0.65
            oil_content = 8 + Math.random() * 8;       // 8-16%
            moisture = 12 + Math.random() * 8;         // 12-20%
            impurities = 4 + Math.random() * 6;        // 4-10%
        }

        // Round to 1 decimal place
        oil_content = Math.round(oil_content * 10) / 10;
        moisture = Math.round(moisture * 10) / 10;
        impurities = Math.round(impurities * 10) / 10;

        // Calculate quality index using weighted formula
        const quality_index = this.calculateQualityIndex({ oil_content, moisture, impurities });

        const data = {
            oil_content,
            moisture,
            impurities,
            temperature: 20 + Math.random() * 10,  // 20-30°C
            purity: Math.round((100 - impurities) * 10) / 10,
            contamination: impurities,
            quality_index: Math.round(quality_index * 1000) / 1000  // Round to 3 decimal places
        };

        const grade = this.determineQualityGrade(data);

        return { grade, data };
    }
}
