import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { blockchainService, BlockchainTransaction } from '@/services/blockchainService';
import {
  Loader2,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  Zap,
  Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlockchainPaymentProps {
  orderId: string;
  amount: number;
  recipientAddress: string;
  recipientName: string;
  onPaymentComplete?: (transaction: BlockchainTransaction) => void;
}

const BlockchainPayment = ({
  orderId,
  amount,
  recipientAddress,
  recipientName,
  onPaymentComplete
}: BlockchainPaymentProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'USDT' | 'ETH' | 'MATIC'>('USDT');
  const [transaction, setTransaction] = useState<BlockchainTransaction | null>(null);
  const [walletAddress, setWalletAddress] = useState('');

  const currencies = [
    { value: 'USDT', label: 'USDT (Stablecoin)', network: 'Polygon/Ethereum' },
    { value: 'ETH', label: 'ETH (Ethereum)', network: 'Ethereum' },
    { value: 'MATIC', label: 'MATIC (Polygon)', network: 'Polygon' }
  ];

  const handlePayment = async () => {
    if (!walletAddress) {
      toast({
        title: 'Error',
        description: 'Please enter your wallet address',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    try {
      const tx = await blockchainService.processPayment(
        walletAddress,
        recipientAddress,
        amount,
        selectedCurrency,
        orderId,
        `Payment for order ${orderId}`
      );

      setTransaction(tx);
      onPaymentComplete?.(tx);

      toast({
        title: 'Payment Initiated',
        description: `Transaction ${tx.id} is being processed`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process payment',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (transaction) {
    return (
      <Card className="border-primary/20 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(transaction.status)}
            Payment Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className={`${getStatusColor(transaction.status)} border capitalize`}>
                {transaction.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Transaction ID</span>
              <span className="text-sm font-mono text-foreground">{transaction.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Hash</span>
              <span className="text-xs font-mono text-foreground truncate">{transaction.transactionHash}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-sm font-semibold">{transaction.amount} {transaction.currency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Time</span>
              <span className="text-sm">{transaction.timestamp.toLocaleTimeString()}</span>
            </div>
          </div>

          {transaction.status === 'confirmed' && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">Payment Confirmed</p>
                <p className="text-xs text-green-700">Your payment has been successfully processed on the blockchain</p>
              </div>
            </div>
          )}

          {transaction.status === 'pending' && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start gap-2">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0 animate-spin" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">Payment Pending</p>
                <p className="text-xs text-yellow-700">Your payment is being confirmed on the blockchain. This usually takes 1-5 minutes.</p>
              </div>
            </div>
          )}

          <Button onClick={() => setTransaction(null)} variant="outline" className="w-full">
            Make Another Payment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Blockchain Payment
        </CardTitle>
        <CardDescription>Secure payment using cryptocurrency</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Details */}
        <div className="space-y-3 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Order ID</span>
            <span className="text-sm font-semibold">{orderId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Recipient</span>
            <span className="text-sm font-semibold">{recipientName}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-sm font-semibold">Amount Due</span>
            <span className="text-lg font-bold text-primary">₹{amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Currency Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Select Payment Currency</Label>
          <div className="grid grid-cols-1 gap-2">
            {currencies.map((curr) => (
              <button
                key={curr.value}
                onClick={() => setSelectedCurrency(curr.value as 'USDT' | 'ETH' | 'MATIC')}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedCurrency === curr.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{curr.label}</p>
                    <p className="text-xs text-muted-foreground">{curr.network}</p>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 border-primary" style={{
                    background: selectedCurrency === curr.value ? 'var(--primary)' : 'transparent'
                  }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Address */}
        <div className="space-y-2">
          <Label htmlFor="wallet" className="text-sm font-semibold">Your Wallet Address</Label>
          <Input
            id="wallet"
            placeholder="0x..."
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">Enter your blockchain wallet address for payment</p>
        </div>

        {/* Security Info */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-2">
          <Lock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-700">
            <p className="font-semibold mb-1">Secure Transaction</p>
            <p>All payments are processed through blockchain smart contracts with escrow protection</p>
          </div>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing || !walletAddress}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Pay ₹{amount.toLocaleString()} with {selectedCurrency}
            </>
          )}
        </Button>

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Transaction fees: ~2-3% depending on network</p>
          <p>• Payment will be confirmed within 1-5 minutes</p>
          <p>• Escrow protection ensures safe transaction</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainPayment;
