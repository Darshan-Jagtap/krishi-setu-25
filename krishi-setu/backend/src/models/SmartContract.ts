import mongoose, { Schema, Document } from 'mongoose';

export interface ISmartContract extends Document {
    contract_id: string;
    order_id: string;
    buyer_id: mongoose.Types.ObjectId;
    seller_id: mongoose.Types.ObjectId;
    buyer_wallet: string;
    seller_wallet: string;

    // Product details
    product_name: string;
    quantity: number;
    unit: string;

    // Quality grades
    agreed_quality_grade: 'A' | 'B' | 'C';
    measured_quality_grade?: 'A' | 'B' | 'C';

    // Pricing
    base_price: number;
    total_amount: number;
    final_amount?: number;
    price_adjustment?: number;
    adjustment_percentage?: number;

    // Status
    status: 'created' | 'funded' | 'delivered' | 'completed' | 'disputed' | 'cancelled';
    payment_status: 'escrow_locked' | 'payment_released' | 'refunded' | 'disputed';

    // Blockchain simulation
    blockchain_hash: string;
    transaction_hash?: string;
    block_number?: number;

    // IoT data
    iot_data?: {
        oil_content?: number;      // OC - Oil Content percentage
        moisture?: number;          // M - Moisture percentage
        impurities?: number;        // IM - Impurities/Contamination percentage
        temperature?: number;
        purity?: number;
        contamination?: number;
        quality_index?: number;     // Q - Calculated quality index
        measured_at?: Date;
    };

    // Timestamps
    created_at: Date;
    funded_at?: Date;
    delivered_at?: Date;
    completed_at?: Date;

    // Additional info
    notes?: string;
    dispute_reason?: string;
}

const SmartContractSchema: Schema = new Schema({
    contract_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    order_id: {
        type: String,
        required: true,
        index: true
    },
    buyer_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buyer_wallet: {
        type: String,
        required: true
    },
    seller_wallet: {
        type: String,
        required: true
    },

    // Product details
    product_name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        default: 'kg'
    },

    // Quality grades
    agreed_quality_grade: {
        type: String,
        enum: ['A', 'B', 'C'],
        required: true
    },
    measured_quality_grade: {
        type: String,
        enum: ['A', 'B', 'C']
    },

    // Pricing
    base_price: {
        type: Number,
        required: true
    },
    total_amount: {
        type: Number,
        required: true
    },
    final_amount: {
        type: Number
    },
    price_adjustment: {
        type: Number,
        default: 0
    },
    adjustment_percentage: {
        type: Number,
        default: 0
    },

    // Status
    status: {
        type: String,
        enum: ['created', 'funded', 'delivered', 'completed', 'disputed', 'cancelled'],
        default: 'created'
    },
    payment_status: {
        type: String,
        enum: ['escrow_locked', 'payment_released', 'refunded', 'disputed'],
        default: 'escrow_locked'
    },

    // Blockchain simulation
    blockchain_hash: {
        type: String,
        required: true,
        unique: true
    },
    transaction_hash: {
        type: String
    },
    block_number: {
        type: Number
    },

    // IoT data
    iot_data: {
        oil_content: Number,
        moisture: Number,
        impurities: Number,
        temperature: Number,
        purity: Number,
        contamination: Number,
        quality_index: Number,
        measured_at: Date
    },

    // Timestamps
    created_at: {
        type: Date,
        default: Date.now
    },
    funded_at: {
        type: Date
    },
    delivered_at: {
        type: Date
    },
    completed_at: {
        type: Date
    },

    // Additional info
    notes: String,
    dispute_reason: String
}, {
    timestamps: true
});

// Indexes for faster queries
SmartContractSchema.index({ buyer_id: 1, created_at: -1 });
SmartContractSchema.index({ seller_id: 1, created_at: -1 });
SmartContractSchema.index({ status: 1 });
SmartContractSchema.index({ payment_status: 1 });

export default mongoose.model<ISmartContract>('SmartContract', SmartContractSchema);
