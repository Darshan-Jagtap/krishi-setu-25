import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Shield,
    CheckCircle2,
    AlertCircle,
    TrendingDown,
    TrendingUp,
    Minus,
    Wallet,
    FileText,
    Package,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { IoTDataDisplay } from './IoTDataDisplay';
import { generateDummyIoTData } from '@/utils/iotDataGenerator';

interface OrderContractDetailsProps {
    orderId: string;
    onRefresh?: () => void;
}

interface ContractDetails {
    agreedQualityGrade: 'A' | 'B' | 'C' | null;
    measuredQualityGrade: 'A' | 'B' | 'C' | null;
    walletAddress: string | null;
    contractTxHash: string | null;
    smartContractId: string | null;
    iotData?: {
        oil_content?: number;
        moisture?: number;
        impurities?: number;
        temperature?: number;
        quality_index?: number;
        measured_at?: string;
    } | null;
}

interface PriceCalculation {
    originalPrice: number;
    finalPrice: number;
    priceAdjustment: number;
    adjustmentPercentage: string;
    degradationMultiplier: number;
}

export function OrderContractDetails({ orderId, onRefresh }: OrderContractDetailsProps) {
    const { toast } = useToast();
    const [contractDetails, setContractDetails] = useState<ContractDetails | null>(null);
    const [priceCalculation, setPriceCalculation] = useState<PriceCalculation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContractDetails();
    }, [orderId]);

    const fetchContractDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Fetch contract details
            const response = await fetch(
                `http://localhost:3000/api/contracts/orders/${orderId}/contract`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 404) {
                // Contract doesn't exist yet - this is normal
                setContractDetails(null);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch contract details');
            }

            const data = await response.json();

            // Handle both old and new API response formats
            const contract = data.contract || data.contractDetails;

            if (contract) {
                const agreedGrade = contract.agreed_quality_grade || contract.agreedQualityGrade;
                const measuredGrade = contract.measured_quality_grade || contract.measuredQualityGrade;

                // Use actual IoT data if available, otherwise generate dummy data
                let iotData = contract.iot_data || null;
                if (!iotData && measuredGrade) {
                    iotData = generateDummyIoTData(agreedGrade, measuredGrade);
                }

                setContractDetails({
                    agreedQualityGrade: agreedGrade,
                    measuredQualityGrade: measuredGrade,
                    walletAddress: contract.buyer_wallet || contract.walletAddress,
                    contractTxHash: contract.blockchain_hash || contract.contractTxHash,
                    smartContractId: contract.contract_id || contract.smartContractId,
                    iotData: iotData,
                });

                // If delivery is finalized, calculate price adjustment
                if (measuredGrade) {
                    await calculatePriceAdjustment(
                        agreedGrade,
                        measuredGrade,
                        contract.total_amount
                    );
                }
            }
        } catch (error: any) {
            console.error('Error fetching contract details:', error);
            // Don't show error toast for missing contracts
            if (!error.message?.includes('404')) {
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to fetch contract details',
                    variant: 'destructive',
                });
            }
            setContractDetails(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Generate dummy IoT data based on quality grades
     * Uses the formula: Q = (OC - M - IM) / 100
     */
    const generateDummyIoTData = (agreedGrade: 'A' | 'B' | 'C' | null, measuredGrade: 'A' | 'B' | 'C' | null) => {
        if (!measuredGrade) return null;

        let oil_content: number;
        let moisture: number;
        let impurities: number;

        // Generate realistic data based on measured grade
        if (measuredGrade === 'A') {
            // Grade A: Q >= 0.80 (e.g., OC=87%, M=5%, IM=2% → Q=0.80)
            oil_content = 85 + Math.random() * 5;  // 85-90%
            moisture = 3 + Math.random() * 5;      // 3-8%
            impurities = 1 + Math.random() * 2;    // 1-3%
        } else if (measuredGrade === 'B') {
            // Grade B: Q = 0.65-0.79 (e.g., OC=80%, M=10%, IM=3% → Q=0.67)
            oil_content = 78 + Math.random() * 7;  // 78-85%
            moisture = 8 + Math.random() * 6;      // 8-14%
            impurities = 2 + Math.random() * 4;    // 2-6%
        } else {
            // Grade C: Q < 0.65 (e.g., OC=70%, M=15%, IM=5% → Q=0.50)
            oil_content = 65 + Math.random() * 10; // 65-75%
            moisture = 12 + Math.random() * 8;     // 12-20%
            impurities = 4 + Math.random() * 6;    // 4-10%
        }

        // Round to 1 decimal place
        oil_content = Math.round(oil_content * 10) / 10;
        moisture = Math.round(moisture * 10) / 10;
        impurities = Math.round(impurities * 10) / 10;

        // Calculate quality index using the formula
        const quality_index = (oil_content - moisture - impurities) / 100;

        return {
            oil_content,
            moisture,
            impurities,
            temperature: Math.round((20 + Math.random() * 10) * 10) / 10,  // 20-30°C
            quality_index: Math.round(quality_index * 100) / 100,
            measured_at: new Date().toISOString()
        };
    };

    const calculatePriceAdjustment = async (agreedGrade: string, measuredGrade: string, totalAmount: number) => {
        try {
            const response = await fetch(
                'http://localhost:3000/api/contracts/orders/calculate-price',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        agreed_quality_grade: agreedGrade,
                        measured_quality_grade: measuredGrade,
                        total_amount: totalAmount,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to calculate price adjustment');
            }

            const data = await response.json();
            const calc = data.calculation || data;

            setPriceCalculation({
                originalPrice: calc.total_amount,
                finalPrice: calc.final_amount,
                priceAdjustment: calc.price_adjustment,
                adjustmentPercentage: `${calc.adjustment_percentage}%`,
                degradationMultiplier: (100 - calc.adjustment_percentage) / 100,
            });
        } catch (error: any) {
            console.error('Error calculating price:', error);
        }
    };

    const getQualityBadgeColor = (grade: string | null) => {
        if (!grade) return 'bg-gray-100 text-gray-800';
        switch (grade) {
            case 'A':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'B':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'C':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getQualityIcon = (agreed: string | null, measured: string | null) => {
        if (!agreed || !measured) return <Minus className="w-4 h-4" />;
        if (measured > agreed) return <TrendingDown className="w-4 h-4 text-red-500" />;
        if (measured < agreed) return <TrendingUp className="w-4 h-4 text-green-500" />;
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    };

    const getPaymentStatus = () => {
        if (!contractDetails?.measuredQualityGrade) {
            return {
                label: 'Pending',
                color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                icon: <Shield className="w-4 h-4" />,
            };
        }
        return {
            label: 'Payment Released',
            color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            icon: <CheckCircle2 className="w-4 h-4" />,
        };
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Smart Contract Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!contractDetails) {
        const handleCreateContract = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                const response = await fetch(
                    `http://localhost:3000/api/contracts/orders/${orderId}/create`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            agreed_quality_grade: 'A', // Default to Grade A
                        }),
                    }
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to create contract');
                }

                toast({
                    title: 'Success',
                    description: 'Smart contract created successfully',
                });

                // Refresh contract details
                await fetchContractDetails();
                if (onRefresh) onRefresh();
            } catch (error: any) {
                console.error('Error creating contract:', error);
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to create smart contract',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        return (
            <Card className="border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-muted-foreground" />
                        Smart Contract Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 space-y-4">
                        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground">
                            No smart contract found for this order
                        </p>
                        <Button onClick={handleCreateContract} className="mt-4">
                            <Shield className="w-4 h-4 mr-2" />
                            Create Smart Contract
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const paymentStatus = getPaymentStatus();

    return (
        <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Smart Contract Details
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                {/* Contract ID and Transaction Hash */}
                <div className="space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Smart Contract ID</p>
                            <p className="font-mono text-sm font-semibold">
                                {contractDetails.smartContractId || 'N/A'}
                            </p>
                        </div>
                        <Badge variant="outline" className="gap-1">
                            <FileText className="w-3 h-3" />
                            On-Chain
                        </Badge>
                    </div>

                    {contractDetails.contractTxHash && (
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Transaction Hash</p>
                            <p className="font-mono text-xs break-all text-primary">
                                {contractDetails.contractTxHash}
                            </p>
                        </div>
                    )}

                    {contractDetails.walletAddress && (
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Wallet className="w-3 h-3" />
                                Buyer Wallet
                            </p>
                            <p className="font-mono text-xs break-all">
                                {contractDetails.walletAddress}
                            </p>
                        </div>
                    )}
                </div>

                <Separator />

                {/* Quality Grades */}
                <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Quality Assessment
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Agreed Quality</p>
                            <Badge className={getQualityBadgeColor(contractDetails.agreedQualityGrade)}>
                                Grade {contractDetails.agreedQualityGrade || 'N/A'}
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Measured Quality</p>
                            {contractDetails.measuredQualityGrade ? (
                                <div className="flex items-center gap-2">
                                    <Badge className={getQualityBadgeColor(contractDetails.measuredQualityGrade)}>
                                        Grade {contractDetails.measuredQualityGrade}
                                    </Badge>
                                    {getQualityIcon(
                                        contractDetails.agreedQualityGrade,
                                        contractDetails.measuredQualityGrade
                                    )}
                                </div>
                            ) : (
                                <Badge variant="outline">Pending Delivery</Badge>
                            )}
                        </div>
                    </div>

                    {/* Quality Comparison */}
                    {contractDetails.agreedQualityGrade && contractDetails.measuredQualityGrade && (
                        <div className="p-3 bg-accent/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                {contractDetails.measuredQualityGrade === contractDetails.agreedQualityGrade ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-semibold text-green-600">
                                            Quality Matched
                                        </span>
                                    </>
                                ) : contractDetails.measuredQualityGrade > contractDetails.agreedQualityGrade ? (
                                    <>
                                        <AlertCircle className="w-4 h-4 text-orange-600" />
                                        <span className="text-sm font-semibold text-orange-600">
                                            Quality Below Agreement
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-semibold text-green-600">
                                            Quality Exceeded
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                IoT sensors verified product quality at delivery
                            </p>
                        </div>
                    )}
                </div>

                {/* IoT Data Display */}
                {contractDetails.iotData && (
                    <IoTDataDisplay
                        iotData={contractDetails.iotData}
                        agreedQualityGrade={contractDetails.agreedQualityGrade}
                        measuredQualityGrade={contractDetails.measuredQualityGrade}
                        getQualityBadgeColor={getQualityBadgeColor}
                    />
                )}

                {/* Price Adjustment */}
                {priceCalculation && (
                    <>
                        <Separator />
                        <div className="space-y-4">
                            <h4 className="font-semibold">Price Adjustment</h4>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Original Price:</span>
                                    <span className="font-semibold">₹{priceCalculation.originalPrice.toLocaleString()}</span>
                                </div>

                                {priceCalculation.priceAdjustment > 0 && (
                                    <div className="flex justify-between text-sm text-orange-600">
                                        <span>Price Reduction ({priceCalculation.adjustmentPercentage}):</span>
                                        <span className="font-semibold">-₹{priceCalculation.priceAdjustment.toLocaleString()}</span>
                                    </div>
                                )}

                                <Separator />

                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Final Price:</span>
                                    <span className="text-xl font-bold text-primary">
                                        ₹{priceCalculation.finalPrice.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                    Price automatically adjusted based on quality degradation matrix.
                                    Seller receives final amount, buyer refunded the difference.
                                </p>
                            </div>
                        </div>
                    </>
                )}

                <Separator />

                {/* Payment Status */}
                <div className="space-y-3">
                    <h4 className="font-semibold">Payment Status</h4>
                    <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                        <div className="flex items-center gap-2">
                            {paymentStatus.icon}
                            <span className="font-semibold">{paymentStatus.label}</span>
                        </div>
                        <Badge className={paymentStatus.color}>
                            {contractDetails.measuredQualityGrade ? 'Completed' : 'Pending'}
                        </Badge>
                    </div>
                </div>

                {onRefresh && (
                    <Button onClick={onRefresh} variant="outline" className="w-full">
                        Refresh Details
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
