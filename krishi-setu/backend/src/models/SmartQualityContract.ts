import mongoose, { Schema, Document } from 'mongoose';

/**
 * Quality Parameters Interface
 */
export interface IQualityParameters {
    oil_content: number;        // OC (%)
    moisture: number;           // M (%)
    impurity: number;          // IM (%)
    measured_at: Date;
}

/**
 * IoT Sensor Data Interface
 */
export interface IIoTData {
    temperature: number;        // °C
    humidity: number;          // %
    moisture: number;          // %
    co2_level: number;         // ppm
    timestamp: Date;
}

/**
 * Degradation Event Interface
 */
export interface IDegradationEvent {
    triggered_at: Date;
    duration_hours: number;
    threshold_violations: {
        temperature?: boolean;
        humidity?: boolean;
        moisture?: boolean;
        co2?: boolean;
    };
    iot_data: IIoTData;
}

/**
 * Grade Change Event Interface
 */
export interface IGradeChangeEvent {
    old_grade: 'A' | 'B' | 'C';
    new_grade: 'A' | 'B' | 'C';
    old_quality_score: number;
    new_quality_score: number;
    changed_at: Date;
}

/**
 * Price Update Event Interface
 */
export interface IPriceUpdateEvent {
    old_price: number;
    new_price: number;
    adjustment_ratio: number;
    updated_at: Date;
}

/**
 * Smart Quality Contract Interface
 */
export interface ISmartQualityContract extends Document {
    // Contract Identification
    contract_id: string;
    order_id: string;
    product_name: string;

    // Parties
    farmer_id: mongoose.Types.ObjectId;
    processor_id: mongoose.Types.ObjectId;
    farmer_wallet: string;
    processor_wallet: string;

    // Product Details
    quantity: number;
    unit: string;
    storage_location: string;

    // Reference Values (Immutable)
    reference_values: {
        oil_content_ref: number;    // OC_ref (e.g., 20%)
        moisture_max: number;        // M_max (e.g., 20%)
        impurity_max: number;        // IM_max (e.g., 10%)
    };

    // Weights for Quality Calculation (Immutable)
    weights: {
        w1: number;  // Oil content weight (0.60)
        w2: number;  // Moisture weight (0.25)
        w3: number;  // Impurity weight (0.15)
    };

    // IoT Thresholds
    iot_thresholds: {
        temperature_warn: number;    // T_warn (e.g., 30°C)
        humidity_warn: number;       // H_warn (e.g., 70%)
        moisture_warn: number;       // M_warn (e.g., 15%)
        co2_warn: number;           // CO2_warn (e.g., 1000 ppm)
        continuous_hours: number;    // D hours (e.g., 24-48)
    };

    // Current State
    current_state: {
        quality_score: number;           // Q (0-1)
        grade: 'A' | 'B' | 'C';
        base_price: number;
        current_price: number;
        last_updated: Date;
    };

    // Initial State (for reference)
    initial_state: {
        quality_score: number;
        grade: 'A' | 'B' | 'C';
        base_price: number;
        quality_parameters: IQualityParameters;
    };

    // Quality History
    quality_history: IQualityParameters[];

    // IoT Data Stream
    iot_data_stream: IIoTData[];

    // Degradation Events
    degradation_events: IDegradationEvent[];

    // Grade Change Events
    grade_change_events: IGradeChangeEvent[];

    // Price Update Events
    price_update_events: IPriceUpdateEvent[];

    // Contract Status
    status: 'active' | 'monitoring' | 'degraded' | 'completed' | 'disputed';

    // Oracle Information
    oracle_address: string;
    last_oracle_update: Date;

    // Timestamps
    created_at: Date;
    updated_at: Date;
    completed_at?: Date;
}

const SmartQualityContractSchema: Schema = new Schema({
    // Contract Identification
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
    product_name: {
        type: String,
        required: true
    },

    // Parties
    farmer_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    processor_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farmer_wallet: {
        type: String,
        required: true
    },
    processor_wallet: {
        type: String,
        required: true
    },

    // Product Details
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        default: 'kg'
    },
    storage_location: {
        type: String,
        required: true
    },

    // Reference Values (Immutable)
    reference_values: {
        oil_content_ref: {
            type: Number,
            required: true,
            default: 20  // 20%
        },
        moisture_max: {
            type: Number,
            required: true,
            default: 20  // 20%
        },
        impurity_max: {
            type: Number,
            required: true,
            default: 10  // 10%
        }
    },

    // Weights (Immutable)
    weights: {
        w1: {
            type: Number,
            required: true,
            default: 0.60
        },
        w2: {
            type: Number,
            required: true,
            default: 0.25
        },
        w3: {
            type: Number,
            required: true,
            default: 0.15
        }
    },

    // IoT Thresholds
    iot_thresholds: {
        temperature_warn: {
            type: Number,
            default: 30  // 30°C
        },
        humidity_warn: {
            type: Number,
            default: 70  // 70%
        },
        moisture_warn: {
            type: Number,
            default: 15  // 15%
        },
        co2_warn: {
            type: Number,
            default: 1000  // 1000 ppm
        },
        continuous_hours: {
            type: Number,
            default: 24  // 24 hours
        }
    },

    // Current State
    current_state: {
        quality_score: {
            type: Number,
            required: true,
            min: 0,
            max: 1
        },
        grade: {
            type: String,
            enum: ['A', 'B', 'C'],
            required: true
        },
        base_price: {
            type: Number,
            required: true
        },
        current_price: {
            type: Number,
            required: true
        },
        last_updated: {
            type: Date,
            default: Date.now
        }
    },

    // Initial State
    initial_state: {
        quality_score: Number,
        grade: {
            type: String,
            enum: ['A', 'B', 'C']
        },
        base_price: Number,
        quality_parameters: {
            oil_content: Number,
            moisture: Number,
            impurity: Number,
            measured_at: Date
        }
    },

    // Quality History
    quality_history: [{
        oil_content: Number,
        moisture: Number,
        impurity: Number,
        measured_at: Date
    }],

    // IoT Data Stream
    iot_data_stream: [{
        temperature: Number,
        humidity: Number,
        moisture: Number,
        co2_level: Number,
        timestamp: Date
    }],

    // Degradation Events
    degradation_events: [{
        triggered_at: Date,
        duration_hours: Number,
        threshold_violations: {
            temperature: Boolean,
            humidity: Boolean,
            moisture: Boolean,
            co2: Boolean
        },
        iot_data: {
            temperature: Number,
            humidity: Number,
            moisture: Number,
            co2_level: Number,
            timestamp: Date
        }
    }],

    // Grade Change Events
    grade_change_events: [{
        old_grade: {
            type: String,
            enum: ['A', 'B', 'C']
        },
        new_grade: {
            type: String,
            enum: ['A', 'B', 'C']
        },
        old_quality_score: Number,
        new_quality_score: Number,
        changed_at: Date
    }],

    // Price Update Events
    price_update_events: [{
        old_price: Number,
        new_price: Number,
        adjustment_ratio: Number,
        updated_at: Date
    }],

    // Contract Status
    status: {
        type: String,
        enum: ['active', 'monitoring', 'degraded', 'completed', 'disputed'],
        default: 'active'
    },

    // Oracle Information
    oracle_address: {
        type: String,
        required: true
    },
    last_oracle_update: {
        type: Date,
        default: Date.now
    },

    // Timestamps
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    completed_at: Date
}, {
    timestamps: true
});

// Indexes for efficient queries
SmartQualityContractSchema.index({ farmer_id: 1, created_at: -1 });
SmartQualityContractSchema.index({ processor_id: 1, created_at: -1 });
SmartQualityContractSchema.index({ status: 1 });
SmartQualityContractSchema.index({ 'current_state.grade': 1 });

export default mongoose.model<ISmartQualityContract>('SmartQualityContract', SmartQualityContractSchema);
