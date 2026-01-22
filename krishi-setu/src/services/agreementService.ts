// Agreement Generation Service
// Generates purchase agreements between farmers and buyers

export interface Agreement {
  id: string;
  buyerId: string;
  sellerId: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  deliveryDate: Date;
  paymentTerms: string;
  qualityStandards: string[];
  penalties: string[];
  createdAt: Date;
  status: 'draft' | 'pending' | 'signed' | 'completed' | 'cancelled';
  buyerSignature?: string;
  sellerSignature?: string;
  signedAt?: Date;
}

class AgreementService {
  /**
   * Generate purchase agreement
   */
  generateAgreement(
    buyerId: string,
    buyerName: string,
    sellerId: string,
    sellerName: string,
    productName: string,
    quantity: number,
    unit: string,
    pricePerUnit: number,
    deliveryDate: Date,
    paymentTerms: string = 'Net 7 days'
  ): Agreement {
    const totalPrice = quantity * pricePerUnit;

    const agreement: Agreement = {
      id: `AGR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      buyerId,
      sellerId,
      productName,
      quantity,
      unit,
      pricePerUnit,
      totalPrice,
      deliveryDate,
      paymentTerms,
      qualityStandards: this.getDefaultQualityStandards(productName),
      penalties: this.getDefaultPenalties(),
      createdAt: new Date(),
      status: 'draft'
    };

    return agreement;
  }

  /**
   * Generate agreement document as HTML
   */
  generateAgreementDocument(agreement: Agreement, buyerName: string, sellerName: string): string {
    const deliveryDateStr = agreement.deliveryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Purchase Agreement - ${agreement.id}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2d5016;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            color: #2d5016;
            font-size: 28px;
          }
          .header p {
            margin: 5px 0;
            color: #666;
            font-size: 14px;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            background: #f0f0f0;
            padding: 10px 15px;
            border-left: 4px solid #2d5016;
            font-weight: bold;
            margin-bottom: 15px;
            font-size: 14px;
            text-transform: uppercase;
          }
          .section-content {
            padding: 0 15px;
          }
          .party {
            display: inline-block;
            width: 48%;
            vertical-align: top;
            margin-right: 2%;
          }
          .party:last-child {
            margin-right: 0;
          }
          .party-label {
            font-weight: bold;
            color: #2d5016;
            margin-bottom: 8px;
            font-size: 13px;
          }
          .party-info {
            background: #f9f9f9;
            padding: 10px;
            border-radius: 4px;
            font-size: 13px;
            line-height: 1.8;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th {
            background: #e8e8e8;
            padding: 10px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #ddd;
            font-size: 13px;
          }
          td {
            padding: 10px;
            border: 1px solid #ddd;
            font-size: 13px;
          }
          .total-row {
            background: #f0f0f0;
            font-weight: bold;
          }
          .terms-list {
            list-style: none;
            padding: 0;
          }
          .terms-list li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
            font-size: 13px;
          }
          .terms-list li:before {
            content: "✓ ";
            color: #2d5016;
            font-weight: bold;
            margin-right: 8px;
          }
          .signature-section {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
          }
          .signature-box {
            width: 45%;
            text-align: center;
          }
          .signature-line {
            border-top: 2px solid #333;
            margin-top: 40px;
            padding-top: 10px;
            font-size: 13px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
          }
          .highlight {
            background: #fffacd;
            padding: 2px 4px;
            border-radius: 2px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>AGRICULTURAL PRODUCT PURCHASE AGREEMENT</h1>
            <p>Agreement ID: <strong>${agreement.id}</strong></p>
            <p>Date: <strong>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
          </div>

          <div class="section">
            <div class="section-title">1. PARTIES TO THE AGREEMENT</div>
            <div class="section-content">
              <div class="party">
                <div class="party-label">SELLER (Farmer/Producer)</div>
                <div class="party-info">
                  <strong>${sellerName}</strong><br>
                  ID: ${agreement.sellerId}<br>
                  Role: Agricultural Producer
                </div>
              </div>
              <div class="party">
                <div class="party-label">BUYER</div>
                <div class="party-info">
                  <strong>${buyerName}</strong><br>
                  ID: ${agreement.buyerId}<br>
                  Role: Buyer/Processor
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">2. PRODUCT DETAILS</div>
            <div class="section-content">
              <table>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Price per Unit</th>
                  <th>Total Amount</th>
                </tr>
                <tr>
                  <td><strong>${agreement.productName}</strong></td>
                  <td>${agreement.quantity}</td>
                  <td>${agreement.unit}</td>
                  <td>₹${agreement.pricePerUnit.toFixed(2)}</td>
                  <td><strong>₹${agreement.totalPrice.toFixed(2)}</strong></td>
                </tr>
              </table>
            </div>
          </div>

          <div class="section">
            <div class="section-title">3. DELIVERY TERMS</div>
            <div class="section-content">
              <p><strong>Delivery Date:</strong> ${deliveryDateStr}</p>
              <p><strong>Delivery Location:</strong> As mutually agreed by both parties</p>
              <p><strong>Delivery Method:</strong> Direct pickup or arranged transportation</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">4. PAYMENT TERMS</div>
            <div class="section-content">
              <p><strong>Payment Method:</strong> Blockchain-based secure payment</p>
              <p><strong>Payment Terms:</strong> ${agreement.paymentTerms}</p>
              <p><strong>Total Amount Due:</strong> <span class="highlight">₹${agreement.totalPrice.toFixed(2)}</span></p>
              <p><strong>Currency:</strong> Indian Rupees (INR) / Cryptocurrency equivalent</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">5. QUALITY STANDARDS</div>
            <div class="section-content">
              <ul class="terms-list">
                ${agreement.qualityStandards.map(standard => `<li>${standard}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="section">
            <div class="section-title">6. PENALTIES & DISPUTE RESOLUTION</div>
            <div class="section-content">
              <ul class="terms-list">
                ${agreement.penalties.map(penalty => `<li>${penalty}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="section">
            <div class="section-title">7. TERMS & CONDITIONS</div>
            <div class="section-content">
              <ul class="terms-list">
                <li>Both parties agree to the terms and conditions outlined in this agreement</li>
                <li>Any modifications must be made in writing and signed by both parties</li>
                <li>This agreement is governed by the laws of India</li>
                <li>Disputes shall be resolved through mutual negotiation or arbitration</li>
                <li>The agreement becomes effective upon digital signature by both parties</li>
              </ul>
            </div>
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <p><strong>SELLER (Farmer)</strong></p>
              <div class="signature-line">
                Signature: _______________<br>
                Name: ${sellerName}<br>
                Date: _______________
              </div>
            </div>
            <div class="signature-box">
              <p><strong>BUYER</strong></p>
              <div class="signature-line">
                Signature: _______________<br>
                Name: ${buyerName}<br>
                Date: _______________
              </div>
            </div>
          </div>

          <div class="footer">
            <p>This is a legally binding agreement. Both parties acknowledge that they have read, understood, and agree to all terms and conditions.</p>
            <p>Generated on AgroChain360 Platform | Agreement ID: ${agreement.id}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return html;
  }

  /**
   * Generate PDF from agreement (requires backend service)
   */
  async generateAgreementPDF(agreement: Agreement, buyerName: string, sellerName: string): Promise<Blob> {
    const html = this.generateAgreementDocument(agreement, buyerName, sellerName);

    // In production, use a library like jsPDF or send to backend for PDF generation
    // For now, return as HTML blob
    return new Blob([html], { type: 'text/html' });
  }

  /**
   * Sign agreement
   */
  signAgreement(agreement: Agreement, userId: string, signature: string): Agreement {
    if (agreement.buyerId === userId) {
      agreement.buyerSignature = signature;
    } else if (agreement.sellerId === userId) {
      agreement.sellerSignature = signature;
    }

    if (agreement.buyerSignature && agreement.sellerSignature) {
      agreement.status = 'signed';
      agreement.signedAt = new Date();
    }

    return agreement;
  }

  private getDefaultQualityStandards(productName: string): string[] {
    const standards: Record<string, string[]> = {
      'mustard': [
        'Moisture content not exceeding 8%',
        'Foreign matter not exceeding 1%',
        'Damaged seeds not exceeding 2%',
        'Purity of variety at least 98%'
      ],
      'soybean': [
        'Moisture content not exceeding 12%',
        'Foreign matter not exceeding 1%',
        'Damaged beans not exceeding 3%',
        'Germination rate at least 85%'
      ],
      'sunflower': [
        'Oil content at least 40%',
        'Moisture content not exceeding 10%',
        'Foreign matter not exceeding 1.5%',
        'Damaged seeds not exceeding 2%'
      ],
      'groundnut': [
        'Moisture content not exceeding 10%',
        'Foreign matter not exceeding 1%',
        'Damaged kernels not exceeding 2%',
        'Aflatoxin levels within safe limits'
      ]
    };

    return standards[productName.toLowerCase()] || [
      'Product must be fresh and free from contamination',
      'Moisture content within acceptable limits',
      'No visible defects or damage',
      'Meets food safety standards'
    ];
  }

  private getDefaultPenalties(): string[] {
    return [
      'Late delivery: 1% penalty per day, maximum 10%',
      'Quality issues: Proportional refund based on damage assessment',
      'Non-delivery: Full refund plus 5% compensation',
      'Payment default: 2% monthly interest on outstanding amount',
      'Breach of contract: Legal action as per applicable laws'
    ];
  }
}

export const agreementService = new AgreementService();
