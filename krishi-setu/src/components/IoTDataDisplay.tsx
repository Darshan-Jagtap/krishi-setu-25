import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Activity, Shield, TrendingDown, Calculator } from 'lucide-react';

interface IoTDataDisplayProps {
    iotData: {
        oil_content?: number;
        moisture?: number;
        impurities?: number;
        temperature?: number;
        quality_index?: number;
        measured_at?: string;
    };
    agreedQualityGrade: 'A' | 'B' | 'C' | null;
    measuredQualityGrade: 'A' | 'B' | 'C' | null;
    getQualityBadgeColor: (grade: string | null) => string;
}

// Reference values
const REFERENCE_VALUES = {
    OC_ref: 20,    // Expected oil content (%)
    M_max: 20,     // Max allowed moisture (%)
    IM_max: 10     // Max allowed impurity (%)
};

// Weights
const WEIGHTS = {
    w1: 0.60,  // Oil content weight
    w2: 0.25,  // Moisture weight
    w3: 0.15   // Impurity weight
};

export function IoTDataDisplay({
    iotData,
    agreedQualityGrade,
    measuredQualityGrade,
    getQualityBadgeColor
}: IoTDataDisplayProps) {
    if (!iotData) return null;

    const { oil_content = 0, moisture = 0, impurities = 0 } = iotData;
    const { OC_ref, M_max, IM_max } = REFERENCE_VALUES;
    const { w1, w2, w3 } = WEIGHTS;

    // Calculate individual components
    const component1 = w1 * (oil_content / OC_ref);
    const component2 = w2 * (1 - moisture / M_max);
    const component3 = w3 * (1 - impurities / IM_max);

    return (
        <>
            <Separator />
            <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    IoT Sensor Data
                </h4>

                {/* Sensor Readings */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-muted-foreground mb-1">Oil Content (OC)</p>
                        <p className="text-2xl font-bold text-blue-600">{oil_content.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Ref: {OC_ref}%</p>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <p className="text-xs text-muted-foreground mb-1">Moisture (M)</p>
                        <p className="text-2xl font-bold text-orange-600">{moisture.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Max: {M_max}%</p>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-xs text-muted-foreground mb-1">Impurities (IM)</p>
                        <p className="text-2xl font-bold text-red-600">{impurities.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Max: {IM_max}%</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                        <p className="text-2xl font-bold text-green-600">{iotData.temperature?.toFixed(1)}°C</p>
                        <p className="text-xs text-muted-foreground mt-1">Ambient</p>
                    </div>
                </div>

                {/* Quality Index Calculation */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-3">
                        <Calculator className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-purple-900 dark:text-purple-100">Quality Score Computation (Q)</span>
                    </div>

                    <div className="space-y-3 text-sm">
                        {/* Formula */}
                        <div className="font-mono bg-white/50 dark:bg-black/20 p-3 rounded">
                            <p className="text-xs text-muted-foreground mb-2">Weighted Formula:</p>
                            <p className="font-semibold text-sm">Q = w₁ × (OC / OC_ref) + w₂ × (1 - M / M_max) + w₃ × (1 - IM / IM_max)</p>
                        </div>

                        {/* Parameters */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/50 dark:bg-black/20 p-2 rounded">
                                <p className="text-xs text-muted-foreground mb-1">Reference Values:</p>
                                <p className="text-xs font-mono">OC_ref = {OC_ref}%</p>
                                <p className="text-xs font-mono">M_max = {M_max}%</p>
                                <p className="text-xs font-mono">IM_max = {IM_max}%</p>
                            </div>
                            <div className="bg-white/50 dark:bg-black/20 p-2 rounded">
                                <p className="text-xs text-muted-foreground mb-1">Weights:</p>
                                <p className="text-xs font-mono">w₁ = {w1} (Oil Content)</p>
                                <p className="text-xs font-mono">w₂ = {w2} (Moisture)</p>
                                <p className="text-xs font-mono">w₃ = {w3} (Impurity)</p>
                            </div>
                        </div>

                        {/* Calculation Steps */}
                        <div className="bg-white/50 dark:bg-black/20 p-3 rounded">
                            <p className="text-xs text-muted-foreground mb-2">Calculation Steps:</p>
                            <div className="space-y-1 font-mono text-xs">
                                <p>1. w₁ × (OC / OC_ref) = {w1} × ({oil_content.toFixed(1)} / {OC_ref}) = <span className="font-bold text-blue-600">{component1.toFixed(3)}</span></p>
                                <p>2. w₂ × (1 - M / M_max) = {w2} × (1 - {moisture.toFixed(1)} / {M_max}) = <span className="font-bold text-orange-600">{component2.toFixed(3)}</span></p>
                                <p>3. w₃ × (1 - IM / IM_max) = {w3} × (1 - {impurities.toFixed(1)} / {IM_max}) = <span className="font-bold text-red-600">{component3.toFixed(3)}</span></p>
                                <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>
                                <p className="text-base">Q = {component1.toFixed(3)} + {component2.toFixed(3)} + {component3.toFixed(3)}</p>
                                <p className="text-lg font-bold text-purple-600 mt-2">Q = {iotData.quality_index?.toFixed(3)}</p>
                            </div>
                        </div>

                        {/* Grade Determination */}
                        <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Grade Criteria:</p>
                                <p className="text-xs">A: Q ≥ 0.80 | B: 0.65 ≤ Q &lt; 0.80 | C: Q &lt; 0.65</p>
                            </div>
                            <Badge className={getQualityBadgeColor(measuredQualityGrade)}>
                                Grade {measuredQualityGrade}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Quality Degradation Impact */}
                {agreedQualityGrade && measuredQualityGrade &&
                    agreedQualityGrade !== measuredQualityGrade && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingDown className="w-4 h-4 text-amber-600" />
                                <span className="font-semibold text-amber-900 dark:text-amber-100">Quality Degradation Impact</span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/50 dark:bg-black/20 p-2 rounded">
                                        <p className="text-xs text-muted-foreground mb-1">Agreed Quality</p>
                                        <p className="font-semibold">Grade {agreedQualityGrade}</p>
                                        <p className="text-xs font-mono mt-1">Expected Q ≈ 0.87</p>
                                    </div>
                                    <div className="bg-white/50 dark:bg-black/20 p-2 rounded">
                                        <p className="text-xs text-muted-foreground mb-1">Measured Quality</p>
                                        <p className="font-semibold">Grade {measuredQualityGrade}</p>
                                        <p className="text-xs font-mono mt-1">Actual Q = {iotData.quality_index?.toFixed(3)}</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-white/50 dark:bg-black/20 rounded">
                                    <p className="text-xs text-muted-foreground mb-1">Price Adjustment Formula:</p>
                                    <p className="font-mono text-xs mb-1">Price_new = Price_old × (Q_new / Q_old)</p>
                                    <p className="text-xs text-amber-700 dark:text-amber-300">
                                        Example: ₹100 × ({iotData.quality_index?.toFixed(3)} / 0.87) ≈ ₹{((iotData.quality_index || 0) / 0.87 * 100).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </>
    );
}
