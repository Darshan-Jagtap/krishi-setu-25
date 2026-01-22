import mongoose, { Schema, Document } from 'mongoose';

export interface IFPOMember extends Document {
    fpo_id: mongoose.Types.ObjectId; // Reference to FPO user
    farmer_id: mongoose.Types.ObjectId; // Reference to Farmer user
    member_since: Date;
    status: 'active' | 'inactive' | 'suspended';
    
    // Member details
    membership_number: string;
    contribution_percentage?: number; // Percentage of FPO revenue this member contributes
    
    // Financial tracking
    total_contributed: number; // Total products/quantity contributed
    total_revenue_generated: number; // Total revenue from this member's products
    pending_payment: number; // Amount pending to be paid to this member
    
    // Additional info
    notes?: string;
    tags?: string[]; // Tags like "premium_producer", "organic", etc.
    
    created_at: Date;
    updated_at: Date;
}

const FPOMemberSchema = new Schema<IFPOMember>({
    fpo_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'FPO ID is required'],
        index: true
    },
    farmer_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Farmer ID is required'],
        index: true
    },
    member_since: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    membership_number: {
        type: String,
        required: [true, 'Membership number is required'],
        trim: true
    },
    contribution_percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    total_contributed: {
        type: Number,
        default: 0,
        min: 0
    },
    total_revenue_generated: {
        type: Number,
        default: 0,
        min: 0
    },
    pending_payment: {
        type: Number,
        default: 0,
        min: 0
    },
    notes: {
        type: String,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Ensure one farmer can only be a member of an FPO once
FPOMemberSchema.index({ fpo_id: 1, farmer_id: 1 }, { unique: true });

// Index for faster queries
FPOMemberSchema.index({ fpo_id: 1, status: 1 });
FPOMemberSchema.index({ farmer_id: 1 });

export default mongoose.model<IFPOMember>('FPOMember', FPOMemberSchema);


