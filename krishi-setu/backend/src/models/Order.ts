import mongoose, { Schema, Document } from 'mongoose';

interface IDeliveryInfo {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
}

export interface IOrder extends Document {
    order_id: string;
    buyer_id: mongoose.Types.ObjectId;
    seller_id?: string;  // Changed to optional string
    product_id?: string; // Changed to optional string
    product_name: string;
    supplier_name: string;
    quantity: number;
    total_price: number;
    status: 'pending' | 'processing' | 'in-transit' | 'delivered' | 'cancelled';
    delivery_info: IDeliveryInfo;
    payment_method: string;
    order_notes?: string;
    smart_contract_id: string;
    blockchain_hash: string;
    tracking_id: string;
    delivery_time: string;
    progress: number;
    created_at: Date;
    updated_at: Date;
}

const OrderSchema = new Schema<IOrder>({
    order_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    buyer_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Buyer ID is required']
    },
    seller_id: {
        type: String,  // Changed to String
        trim: true
    },
    product_id: {
        type: String,  // Changed to String
        trim: true
    },
    product_name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    supplier_name: {
        type: String,
        required: [true, 'Supplier name is required'],
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative']
    },
    total_price: {
        type: Number,
        required: [true, 'Total price is required'],
        min: [0, 'Total price cannot be negative']
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'in-transit', 'delivered', 'cancelled'],
        default: 'pending'
    },
    delivery_info: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        landmark: { type: String }
    },
    payment_method: {
        type: String,
        required: [true, 'Payment method is required'],
        trim: true
    },
    order_notes: {
        type: String,
        trim: true
    },
    smart_contract_id: {
        type: String,
        required: [true, 'Smart contract ID is required'],
        trim: true
    },
    blockchain_hash: {
        type: String,
        required: [true, 'Blockchain hash is required'],
        trim: true
    },
    tracking_id: {
        type: String,
        required: [true, 'Tracking ID is required'],
        trim: true
    },
    delivery_time: {
        type: String,
        trim: true
    },
    progress: {
        type: Number,
        default: 30,
        min: 0,
        max: 100
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for faster queries
OrderSchema.index({ buyer_id: 1, created_at: -1 });
OrderSchema.index({ seller_id: 1, created_at: -1 });
OrderSchema.index({ order_id: 1 });
OrderSchema.index({ status: 1 });

export default mongoose.model<IOrder>('Order', OrderSchema);
