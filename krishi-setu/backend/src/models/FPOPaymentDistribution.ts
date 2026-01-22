import mongoose, { Schema, Document } from 'mongoose';

export interface IFPOPaymentDistribution extends Document {
    fpo_id: mongoose.Types.ObjectId; // Reference to FPO user
    order_id: mongoose.Types.ObjectId; // Reference to Order
    distribution_date: Date;
    total_amount: number; // Total amount to distribute
    distribution_status: 'pending' | 'processing' | 'completed' | 'failed';
    
    // Member distributions
    distributions: Array<{
        member_id: mongoose.Types.ObjectId; // Reference to FPOMember
        farmer_id: mongoose.Types.ObjectId; // Reference to Farmer user
        amount: number;
        percentage: number;
        product_contribution: number; // Quantity contributed by this member
        status: 'pending' | 'paid' | 'failed';
        payment_method?: string;
        transaction_hash?: string;
        paid_at?: Date;
    }>;
    
    // Additional info
    notes?: string;
    created_at: Date;
    updated_at: Date;
}

const FPOPaymentDistributionSchema = new Schema<IFPOPaymentDistribution>({
    fpo_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'FPO ID is required'],
        index: true
    },
    order_id: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: [true, 'Order ID is required'],
        index: true
    },
    distribution_date: {
        type: Date,
        default: Date.now
    },
    total_amount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: 0
    },
    distribution_status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    distributions: [{
        member_id: {
            type: Schema.Types.ObjectId,
            ref: 'FPOMember',
            required: true
        },
        farmer_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        percentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        product_contribution: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending'
        },
        payment_method: String,
        transaction_hash: String,
        paid_at: Date
    }],
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index for faster queries
FPOPaymentDistributionSchema.index({ fpo_id: 1, distribution_status: 1 });
FPOPaymentDistributionSchema.index({ order_id: 1 });

export default mongoose.model<IFPOPaymentDistribution>('FPOPaymentDistribution', FPOPaymentDistributionSchema);


