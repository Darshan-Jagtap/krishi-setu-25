import SmartQualityContract, {
    ISmartQualityContract,
    IQualityParameters,
    IIoTData,
    IDegradationEvent,
    IGradeChangeEvent,
    IPriceUpdateEvent
} from '../models/SmartQualityContract';
import crypto from 'crypto';

/**
 * Smart Quality Contract Service
 * 
 * Implements hybrid blockchain logic for quality-based pricing
 * with IoT-driven degradation detection and automatic grade/price adjustment
 */
export class SmartQualityContractService {

    /**
     * QUALITY SCORE COMPUTATION
     * 
     * Formula: Q = w1 * (OC / OC_ref) + w2 * (1 - M / M_max) + w3 * (1 - IM / IM_max)
     * 
     * Where:
     * - OC = Oil Content (%)
     * - M = Moisture (%)
     * - IM = Impurity (%)
     * - w1, w2, w3 = Weights (0.60, 0.25, 0.15)
     * 
     * Returns: Q value between 0 and 1
     */
    static computeQuality(
        params: IQualityParameters,
        refValues: { oil_content_ref: number; moisture_max: number; impurity_max: number },
        weights: { w1: number; w2: number; w3: number }
    ): number {
        const { oil_content, moisture, impurity } = params;
        const { oil_content_ref, moisture_max, impurity_max } = refValues;
        const { w1, w2, w3 } = weights;

        // Validate inputs
        if (oil_content < 0 || moisture < 0 || impurity < 0) {
            throw new Error('Quality parameters cannot be negative');
        }

        if (moisture > moisture_max) {
            console.warn(`Moisture ${moisture}% exceeds maximum ${moisture_max}%`);
        }

        if (impurity > impurity_max) {
            console.warn(`Impurity ${impurity}% exceeds maximum ${impurity_max}%`);
        }

        // Calculate quality score
        const term1 = w1 * (oil_content / oil_content_ref);
        const term2 = w2 * (1 - Math.min(moisture / moisture_max, 1));
        const term3 = w3 * (1 - Math.min(impurity / impurity_max, 1));

        const Q = term1 + term2 + term3;

        // Clamp between 0 and 1
        return Math.max(0, Math.min(1, Q));
    }

    /**
     * GRADE MAPPING
     * 
     * Q ≥ 0.82 → Grade A
     * 0.65 ≤ Q < 0.82 → Grade B
     * Q < 0.65 → Grade C
     */
    static getGrade(qualityScore: number): 'A' | 'B' | 'C' {
        if (qualityScore >= 0.82) {
            return 'A';
        } else if (qualityScore >= 0.65) {
            return 'B';
        } else {
            return 'C';
        }
    }

    /**
     * PRICE ADJUSTMENT FORMULA
     * 
     * Price_new = Price_old * (Q_new / Q_old)
     * 
     * Pure ratio-based quality adjustment
     * No penalties, no manual negotiation
     */
    static calculateNewPrice(
        oldPrice: number,
        oldQuality: number,
        newQuality: number
    ): number {
        if (oldQuality <= 0) {
            throw new Error('Old quality score must be positive');
        }

        const adjustmentRatio = newQuality / oldQuality;
        const newPrice = oldPrice * adjustmentRatio;

        // Ensure non-negative
        return Math.max(0, newPrice);
    }

    /**
     * IOT DEGRADATION DETECTION
     * 
     * Checks if IoT data exceeds thresholds:
     * - temperature > T_warn
     * - humidity > H_warn
     * - moisture > M_warn
     * - CO₂ > CO2_warn
     */
    static checkDegradationThresholds(
        iotData: IIoTData,
        thresholds: {
            temperature_warn: number;
            humidity_warn: number;
            moisture_warn: number;
            co2_warn: number;
        }
    ): {
        temperature?: boolean;
        humidity?: boolean;
        moisture?: boolean;
        co2?: boolean;
    } {
        const violations: any = {};

        if (iotData.temperature > thresholds.temperature_warn) {
            violations.temperature = true;
        }

        if (iotData.humidity > thresholds.humidity_warn) {
            violations.humidity = true;
        }

        if (iotData.moisture > thresholds.moisture_warn) {
            violations.moisture = true;
        }

        if (iotData.co2_level > thresholds.co2_warn) {
            violations.co2 = true;
        }

        return violations;
    }

    /**
     * CHECK CONTINUOUS VIOLATION
     * 
     * Verifies if thresholds have been exceeded continuously for D hours
     */
    static async checkContinuousViolation(
        contractId: string,
        requiredHours: number
    ): Promise<boolean> {
        const contract = await SmartQualityContract.findOne({ contract_id: contractId });

        if (!contract) {
            return false;
        }

        const now = new Date();
        const cutoffTime = new Date(now.getTime() - requiredHours * 60 * 60 * 1000);

        // Get recent IoT data within the time window
        const recentData = contract.iot_data_stream.filter(
            data => data.timestamp >= cutoffTime
        );

        if (recentData.length === 0) {
            return false;
        }

        // Check if ALL recent data points exceed thresholds
        const allViolating = recentData.every(data => {
            const violations = this.checkDegradationThresholds(data, contract.iot_thresholds);
            return Object.keys(violations).length > 0;
        });

        return allViolating;
    }

    /**
     * CREATE SMART QUALITY CONTRACT
     */
    static async createContract(data: {
        order_id: string;
        farmer_id: string;
        processor_id: string;
        product_name: string;
        quantity: number;
        unit?: string;
        storage_location: string;
        base_price: number;
        initial_quality: IQualityParameters;
        farmer_wallet?: string;
        processor_wallet?: string;
    }): Promise<ISmartQualityContract> {

        // Generate contract ID
        const contract_id = `SQC-${data.order_id}`;

        // Generate wallet addresses if not provided
        const farmer_wallet = data.farmer_wallet || '0x' + crypto.randomBytes(20).toString('hex');
        const processor_wallet = data.processor_wallet || '0x' + crypto.randomBytes(20).toString('hex');

        // Default reference values
        const reference_values = {
            oil_content_ref: 20,  // 20%
            moisture_max: 20,     // 20%
            impurity_max: 10      // 10%
        };

        // Default weights
        const weights = {
            w1: 0.60,
            w2: 0.25,
            w3: 0.15
        };

        // Compute initial quality score
        const initial_quality_score = this.computeQuality(
            data.initial_quality,
            reference_values,
            weights
        );

        // Determine initial grade
        const initial_grade = this.getGrade(initial_quality_score);

        // Create contract
        const contract = new SmartQualityContract({
            contract_id,
            order_id: data.order_id,
            product_name: data.product_name,
            farmer_id: data.farmer_id,
            processor_id: data.processor_id,
            farmer_wallet,
            processor_wallet,
            quantity: data.quantity,
            unit: data.unit || 'kg',
            storage_location: data.storage_location,
            reference_values,
            weights,
            iot_thresholds: {
                temperature_warn: 30,
                humidity_warn: 70,
                moisture_warn: 15,
                co2_warn: 1000,
                continuous_hours: 24
            },
            current_state: {
                quality_score: initial_quality_score,
                grade: initial_grade,
                base_price: data.base_price,
                current_price: data.base_price,
                last_updated: new Date()
            },
            initial_state: {
                quality_score: initial_quality_score,
                grade: initial_grade,
                base_price: data.base_price,
                quality_parameters: data.initial_quality
            },
            quality_history: [data.initial_quality],
            iot_data_stream: [],
            degradation_events: [],
            grade_change_events: [],
            price_update_events: [],
            status: 'active',
            oracle_address: '0x' + crypto.randomBytes(20).toString('hex'),
            last_oracle_update: new Date()
        });

        await contract.save();

        console.log(`✅ Smart Quality Contract created: ${contract_id}`);
        console.log(`   Initial Quality Score: ${initial_quality_score.toFixed(4)}`);
        console.log(`   Initial Grade: ${initial_grade}`);
        console.log(`   Base Price: ₹${data.base_price}`);

        return contract;
    }

    /**
     * INGEST IOT DATA
     * 
     * Adds new IoT sensor reading to the contract
     */
    static async ingestIoTData(
        contractId: string,
        iotData: IIoTData
    ): Promise<void> {
        const contract = await SmartQualityContract.findOne({ contract_id: contractId });

        if (!contract) {
            throw new Error('Contract not found');
        }

        // Add to IoT data stream
        contract.iot_data_stream.push(iotData);
        contract.last_oracle_update = new Date();

        // Check for threshold violations
        const violations = this.checkDegradationThresholds(iotData, contract.iot_thresholds);

        if (Object.keys(violations).length > 0) {
            console.log(`⚠️ Threshold violations detected in ${contractId}:`, violations);
            contract.status = 'monitoring';
        }

        await contract.save();
    }

    /**
     * TRIGGER DEGRADATION EVENT
     * 
     * Called when continuous threshold violation is detected
     */
    static async triggerDegradationEvent(
        contractId: string,
        newQualityParams: IQualityParameters
    ): Promise<{
        gradeChanged: boolean;
        priceChanged: boolean;
        contract: ISmartQualityContract;
    }> {
        const contract = await SmartQualityContract.findOne({ contract_id: contractId });

        if (!contract) {
            throw new Error('Contract not found');
        }

        // Get latest IoT data
        const latestIoT = contract.iot_data_stream[contract.iot_data_stream.length - 1];

        if (!latestIoT) {
            throw new Error('No IoT data available');
        }

        // Check continuous violation
        const isContinuous = await this.checkContinuousViolation(
            contractId,
            contract.iot_thresholds.continuous_hours
        );

        if (!isContinuous) {
            throw new Error('Continuous violation requirement not met');
        }

        // Calculate duration
        const oldestRelevantData = contract.iot_data_stream.find(
            data => data.timestamp >= new Date(Date.now() - contract.iot_thresholds.continuous_hours * 60 * 60 * 1000)
        );

        const durationHours = oldestRelevantData
            ? (latestIoT.timestamp.getTime() - oldestRelevantData.timestamp.getTime()) / (1000 * 60 * 60)
            : 0;

        // Record degradation event
        const degradationEvent: IDegradationEvent = {
            triggered_at: new Date(),
            duration_hours: durationHours,
            threshold_violations: this.checkDegradationThresholds(latestIoT, contract.iot_thresholds),
            iot_data: latestIoT
        };

        contract.degradation_events.push(degradationEvent);

        // Compute new quality score
        const old_quality_score = contract.current_state.quality_score;
        const old_grade = contract.current_state.grade;
        const old_price = contract.current_state.current_price;

        const new_quality_score = this.computeQuality(
            newQualityParams,
            contract.reference_values,
            contract.weights
        );

        const new_grade = this.getGrade(new_quality_score);

        // Add to quality history
        contract.quality_history.push(newQualityParams);

        let gradeChanged = false;
        let priceChanged = false;

        // Check if grade changed
        if (new_grade !== old_grade) {
            gradeChanged = true;

            // Record grade change event
            const gradeChangeEvent: IGradeChangeEvent = {
                old_grade,
                new_grade,
                old_quality_score,
                new_quality_score,
                changed_at: new Date()
            };

            contract.grade_change_events.push(gradeChangeEvent);

            // Update grade
            contract.current_state.grade = new_grade;

            console.log(`📊 Grade changed: ${old_grade} → ${new_grade}`);
        }

        // Update quality score
        contract.current_state.quality_score = new_quality_score;

        // Calculate new price
        const new_price = this.calculateNewPrice(old_price, old_quality_score, new_quality_score);

        if (new_price !== old_price) {
            priceChanged = true;

            // Record price update event
            const priceUpdateEvent: IPriceUpdateEvent = {
                old_price,
                new_price,
                adjustment_ratio: new_quality_score / old_quality_score,
                updated_at: new Date()
            };

            contract.price_update_events.push(priceUpdateEvent);

            // Update price
            contract.current_state.current_price = new_price;

            console.log(`💰 Price adjusted: ₹${old_price.toFixed(2)} → ₹${new_price.toFixed(2)}`);
        }

        contract.current_state.last_updated = new Date();
        contract.status = 'degraded';

        await contract.save();

        console.log(`🔄 Degradation event processed for ${contractId}`);
        console.log(`   Quality Score: ${old_quality_score.toFixed(4)} → ${new_quality_score.toFixed(4)}`);
        console.log(`   Grade: ${old_grade} → ${new_grade}`);
        console.log(`   Price: ₹${old_price.toFixed(2)} → ₹${new_price.toFixed(2)}`);

        return {
            gradeChanged,
            priceChanged,
            contract
        };
    }

    /**
     * GET CONTRACT BY ID
     */
    static async getContract(contractId: string): Promise<ISmartQualityContract | null> {
        return await SmartQualityContract.findOne({ contract_id: contractId })
            .populate('farmer_id', 'full_name email')
            .populate('processor_id', 'full_name email');
    }

    /**
     * GET CONTRACT BY ORDER ID
     */
    static async getContractByOrderId(orderId: string): Promise<ISmartQualityContract | null> {
        return await SmartQualityContract.findOne({ order_id: orderId })
            .populate('farmer_id', 'full_name email')
            .populate('processor_id', 'full_name email');
    }

    /**
     * COMPLETE CONTRACT
     */
    static async completeContract(contractId: string): Promise<ISmartQualityContract> {
        const contract = await SmartQualityContract.findOne({ contract_id: contractId });

        if (!contract) {
            throw new Error('Contract not found');
        }

        contract.status = 'completed';
        contract.completed_at = new Date();

        await contract.save();

        return contract;
    }
}
