import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2 } from "lucide-react";

interface TransactionCardProps {
  transaction: {
    id: string;
    product: string;
    amount: number;
    from: string;
    to: string;
    hash: string;
    timestamp: number;
    verified: boolean;
  };
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const date = new Date(transaction.timestamp).toLocaleString();

  return (
    <Card className="border-border hover:border-primary transition-all duration-300 hover:shadow-lg animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{transaction.product}</h3>
              <p className="text-sm text-muted-foreground">{date}</p>
            </div>
          </div>
          {transaction.verified && (
            <Badge variant="default" className="flex items-center gap-1 animate-scale-in">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-semibold text-foreground">₹{transaction.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">From:</span>
            <span className="font-mono text-xs text-foreground">{transaction.from.slice(0, 8)}...{transaction.from.slice(-6)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">To:</span>
            <span className="font-mono text-xs text-foreground">{transaction.to.slice(0, 8)}...{transaction.to.slice(-6)}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <span className="text-muted-foreground text-xs">Transaction Hash:</span>
            <p className="font-mono text-xs text-foreground mt-1 break-all">{transaction.hash}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;