import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    seller_id: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    category: string;
    price: number;
    quantity: number;
    unit: string;
    image_url?: string;
    location?: string;
    status: 'available' | 'sold' | 'reserved';
    created_at: Date;
    updated_at: Date;
}

const ProductSchema = new Schema<IProduct>({
    seller_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Seller ID is required']
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative']
    },
    unit: {
        type: String,
        default: 'kg',
        trim: true
    },
    image_url: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'reserved'],
        default: 'available'
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

// Index for faster queries
ProductSchema.index({ seller_id: 1, status: 1 });
ProductSchema.index({ category: 1, status: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
