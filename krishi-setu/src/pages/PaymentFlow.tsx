import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BlockchainPayment from '@/components/BlockchainPayment';
import AgreementViewer from '@/components/AgreementViewer';
import { agreementService, Agreement } from '@/services/agreementService';
import { BlockchainTransaction } from '@/services/blockchainService';
import {
  CheckCircle2,
  Clock,
  FileText,
  CreditCard,
  AlertCircle,
  ArrowRight,
  Zap
} from 'lucide-react';

const PaymentFlow = () => {
  const [currentStep, setCurrentStep] = useState<'agreement' | 'payment' | 'confirmation'>(
    'agreement'
  );
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [transaction, setTransaction] = useState<BlockchainTransaction | null>(null);

  // Mock data for demonstration
  const mockOrder = {
    id: 'ORD001',
    product: 'Mustard Oil',
    quantity: 500,
    unit: 'kg',
    pricePerUnit: 4800,
    totalAmount: 2400000,
    buyerId: 'buyer_123',
    buyerName: 'Green Industries Ltd',
    sellerId: 'farmer_456',
    sellerName: 'Farmer John',
    deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    recipientAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f42e0d'
  };

  const handleGenerateAgreement = () => {
    const newAgreement = agreementService.generateAgreement(
      mockOrder.buyerId,
      mockOrder.buyerName,
      mockOrder.sellerId,
      mockOrder.sellerName,
      mockOrder.product,
      mockOrder.quantity,
      mockOrder.unit,
      mockOrder.pricePerUnit,
      mockOrder.deliveryDate
    );
    setAgreement(newAgreement);
  };

  const handleAgreementSigned = (signedAgreement: Agreement) => {
    setAgreement(signedAgreement);
    if (signedAgreement.buyerSignature && signedAgreement.sellerSignature) {
      setCurrentStep('payment');
    }
  };

  const handlePaymentComplete = (tx: BlockchainTransaction) => {
    setTransaction(tx);
    setCurrentStep('confirmation');
  };

  const steps = [
    {
      id: 'agreement',
      label: 'Agreement',
      description: 'Create and sign purchase agreement',
      icon: FileText,
      completed: agreement && agreement.buyerSignature && agreement.sellerSignature
    },
    {
      id: 'payment',
      label: 'Payment',
      description: 'Process blockchain payment',
      icon: CreditCard,
      completed: transaction && transaction.status === 'confirmed'
    },
    {
      id: 'confirmation',
      label: 'Confirmation',
      description: 'Transaction complete',
      icon: CheckCircle2,
      completed: transaction && transaction.status === 'confirmed'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="w-8 h-8 text-primary" />
            Transaction Flow
          </h1>
          <p className="text-muted-foreground">Complete purchase with agreement and blockchain payment</p>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = step.completed;

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                          isCompleted
                            ? 'bg-green-100 text-green-600'
                            : isActive
                            ? 'bg-primary text-white scale-110'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-center">{step.label}</p>
                      <p className="text-xs text-muted-foreground text-center mt-1">{step.description}</p>
                    </div>

                    {idx < steps.length - 1 && (
                      <div
                        className={`w-12 h-1 mx-2 transition-all ${
                          isCompleted ? 'bg-green-600' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 'agreement' && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Purchase Agreement
                  </CardTitle>
                  <CardDescription>
                    Create and sign the purchase agreement before payment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!agreement ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        No agreement generated yet. Click below to create one.
                      </p>
                      <Button onClick={handleGenerateAgreement} size="lg">
                        Generate Agreement
                      </Button>
                    </div>
                  ) : (
                    <AgreementViewer
                      agreement={agreement}
                      buyerName={mockOrder.buyerName}
                      sellerName={mockOrder.sellerName}
                      currentUserId={mockOrder.buyerId}
                      onSign={handleAgreementSigned}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 'payment' && agreement && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Blockchain Payment
                  </CardTitle>
                  <CardDescription>
                    Secure payment using cryptocurrency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BlockchainPayment
                    orderId={mockOrder.id}
                    amount={mockOrder.totalAmount}
                    recipientAddress={mockOrder.recipientAddress}
                    recipientName={mockOrder.sellerName}
                    onPaymentComplete={handlePaymentComplete}
                  />
                </CardContent>
              </Card>
            )}

            {currentStep === 'confirmation' && transaction && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Transaction Complete
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Agreement Signed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Payment Confirmed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Blockchain Verified</span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Next Steps:</span> The seller will prepare the shipment. You can track the delivery status in your orders page.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Agreement
                    </Button>
                    <Button className="flex-1">
                      Track Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <div className="space-y-4">
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-semibold">{mockOrder.product}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-semibold">{mockOrder.quantity} {mockOrder.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price per Unit</p>
                  <p className="font-semibold">₹{mockOrder.pricePerUnit.toLocaleString()}</p>
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-xl font-bold text-primary">₹{mockOrder.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Date</p>
                  <p className="font-semibold">{mockOrder.deliveryDate.toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card className="animate-scale-in" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <CardTitle className="text-lg">Status Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Agreement Created', completed: !!agreement },
                  { label: 'Agreement Signed', completed: agreement?.buyerSignature && agreement?.sellerSignature },
                  { label: 'Payment Initiated', completed: !!transaction && transaction.status === 'pending' },
                  { label: 'Payment Confirmed', completed: !!transaction && transaction.status === 'confirmed' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={item.completed ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Info Box */}
            <Card className="bg-blue-50 border-blue-200 animate-scale-in" style={{ animationDelay: '200ms' }}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Secure Transaction</p>
                    <p>All transactions are protected by blockchain smart contracts and escrow services.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentFlow;
