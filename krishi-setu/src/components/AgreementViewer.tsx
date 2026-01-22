import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Agreement, agreementService } from '@/services/agreementService';
import {
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Printer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AgreementViewerProps {
  agreement: Agreement;
  buyerName: string;
  sellerName: string;
  currentUserId: string;
  onSign?: (agreement: Agreement) => void;
}

const AgreementViewer = ({
  agreement,
  buyerName,
  sellerName,
  currentUserId,
  onSign
}: AgreementViewerProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const isCurrentUserBuyer = currentUserId === agreement.buyerId;
  const isCurrentUserSeller = currentUserId === agreement.sellerId;
  const hasUserSigned = isCurrentUserBuyer ? !!agreement.buyerSignature : !!agreement.sellerSignature;
  const bothSigned = !!agreement.buyerSignature && !!agreement.sellerSignature;

  const handleSign = async () => {
    setIsLoading(true);
    try {
      // Generate signature (in production, use digital signature)
      const signature = `${currentUserId}_${Date.now()}`;
      const updatedAgreement = agreementService.signAgreement(agreement, currentUserId, signature);
      
      onSign?.(updatedAgreement);

      toast({
        title: 'Agreement Signed',
        description: 'Your signature has been recorded'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign agreement',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsLoading(true);
    try {
      const blob = await agreementService.generateAgreementPDF(agreement, buyerName, sellerName);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agreement_${agreement.id}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Downloaded',
        description: 'Agreement document downloaded successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download agreement',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    const html = agreementService.generateAgreementDocument(agreement, buyerName, sellerName);
    const printWindow = window.open('', '', 'width=900,height=600');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Purchase Agreement
              </CardTitle>
              <CardDescription>Agreement ID: {agreement.id}</CardDescription>
            </div>
            <Badge className={`${getStatusColor(agreement.status)} border capitalize`}>
              {agreement.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Agreement Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Agreement Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Parties */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Seller (Farmer)</h4>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{sellerName}</p>
                <p className="text-xs text-muted-foreground">{agreement.sellerId}</p>
                {agreement.sellerSignature && (
                  <div className="flex items-center gap-1 mt-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-semibold">Signed</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Buyer</h4>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{buyerName}</p>
                <p className="text-xs text-muted-foreground">{agreement.buyerId}</p>
                {agreement.buyerSignature && (
                  <div className="flex items-center gap-1 mt-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-semibold">Signed</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-3">Product Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-muted-foreground mb-1">Product</p>
                <p className="font-semibold text-sm">{agreement.productName}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                <p className="font-semibold text-sm">{agreement.quantity} {agreement.unit}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-muted-foreground mb-1">Price/Unit</p>
                <p className="font-semibold text-sm">₹{agreement.pricePerUnit}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                <p className="font-semibold text-sm text-green-600">₹{agreement.totalPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Delivery Terms</h4>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Date:</span> {agreement.deliveryDate.toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Payment Terms:</span> {agreement.paymentTerms}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Quality Standards</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {agreement.qualityStandards.slice(0, 2).map((std, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{std}</span>
                    </li>
                  ))}
                  {agreement.qualityStandards.length > 2 && (
                    <li className="text-xs text-primary">+{agreement.qualityStandards.length - 2} more</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide' : 'Preview'} Full Document
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download
            </Button>

            {!hasUserSigned && (isCurrentUserBuyer || isCurrentUserSeller) && (
              <Button
                onClick={handleSign}
                disabled={isLoading}
                className="flex items-center gap-2 ml-auto"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Sign Agreement
              </Button>
            )}
          </div>

          {bothSigned && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">Agreement Fully Signed</p>
                <p className="text-xs text-green-700">Both parties have signed this agreement. Proceed with transaction.</p>
              </div>
            </div>
          )}

          {!bothSigned && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">Awaiting Signatures</p>
                <p className="text-xs text-yellow-700">
                  {!agreement.buyerSignature && !agreement.sellerSignature && 'Both parties need to sign'}
                  {agreement.buyerSignature && !agreement.sellerSignature && 'Waiting for seller signature'}
                  {!agreement.buyerSignature && agreement.sellerSignature && 'Waiting for buyer signature'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Document Preview */}
      {showPreview && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="text-lg">Full Agreement Document</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none bg-white p-6 rounded-lg border"
              dangerouslySetInnerHTML={{
                __html: agreementService.generateAgreementDocument(agreement, buyerName, sellerName)
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgreementViewer;
