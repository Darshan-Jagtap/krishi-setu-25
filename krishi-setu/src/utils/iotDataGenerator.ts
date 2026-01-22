/**
 * Generate dummy IoT data based on quality grades using weighted formula
 * Q = w1 * (OC / OC_ref) + w2 * (1 - M / M_max) + w3 * (1 - IM / IM_max)
 */
export const generateDummyIoTData = (measuredGrade: 'A' | 'B' | 'C' | null) => {
    if (!measuredGrade) return null;

    // Reference values
    const OC_ref = 20;    // Expected oil content (%)
    const M_max = 20;     // Max allowed moisture (%)
    const IM_max = 10;    // Max allowed impurity (%)

    // Weights
    const w1 = 0.60;  // Oil content weight
    const w2 = 0.25;  // Moisture weight
    const w3 = 0.15;  // Impurity weight

    let oil_content: number;
    let moisture: number;
    let impurities: number;

    // Generate realistic data based on measured grade to achieve target Q
    if (measuredGrade === 'A') {
        // Target Q >= 0.80
        oil_content = 18 + Math.random() * 4;  // 18-22%
        moisture = 5 + Math.random() * 5;      // 5-10%
        impurities = 1 + Math.random() * 2;    // 1-3%
    } else if (measuredGrade === 'B') {
        // Target Q = 0.65-0.79
        oil_content = 14 + Math.random() * 6;  // 14-20%
        moisture = 8 + Math.random() * 7;      // 8-15%
        impurities = 2 + Math.random() * 4;    // 2-6%
    } else {
        // Grade C: Q < 0.65
        oil_content = 10 + Math.random() * 6;  // 10-16%
        moisture = 12 + Math.random() * 8;     // 12-20%
        impurities = 4 + Math.random() * 6;    // 4-10%
    }

    // Round to 1 decimal place
    oil_content = Math.round(oil_content * 10) / 10;
    moisture = Math.round(moisture * 10) / 10;
    impurities = Math.round(impurities * 10) / 10;

    // Calculate quality index using weighted formula
    const Q = w1 * (oil_content / OC_ref)
        + w2 * (1 - moisture / M_max)
        + w3 * (1 - impurities / IM_max);

    const quality_index = Math.max(0, Math.min(1, Q)); // Clamp between 0 and 1

    return {
        oil_content,
        moisture,
        impurities,
        temperature: Math.round((20 + Math.random() * 10) * 10) / 10,  // 20-30°C
        quality_index: Math.round(quality_index * 1000) / 1000,  // Round to 3 decimal places
        measured_at: new Date().toISOString()
    };
};
