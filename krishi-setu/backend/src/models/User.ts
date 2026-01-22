import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    location?: string;
    role: 'farmer' | 'processor' | 'buyer' | 'fpo';
    // FPO-specific fields
    fpo_registration_number?: string;
    fpo_name?: string;
    fpo_members_count?: number;
    fpo_establishment_year?: number;
    created_at: Date;
    updated_at: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    full_name: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['farmer', 'processor', 'buyer', 'fpo'],
        required: [true, 'Role is required']
    },
    // FPO-specific fields
    fpo_registration_number: {
        type: String,
        trim: true,
        sparse: true // Allows null values but ensures uniqueness when present
    },
    fpo_name: {
        type: String,
        trim: true
    },
    fpo_members_count: {
        type: Number,
        min: [1, 'FPO must have at least 1 member']
    },
    fpo_establishment_year: {
        type: Number,
        min: [1900, 'Invalid establishment year'],
        max: [new Date().getFullYear(), 'Establishment year cannot be in the future']
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

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};

export default mongoose.model<IUser>('User', UserSchema);
