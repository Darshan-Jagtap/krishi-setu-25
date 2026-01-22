// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title QualityEscrow
 * @dev Smart contract for quality-based escrow payments in agricultural marketplace
 * Supports automatic price adjustment based on IoT quality verification
 */
contract QualityEscrow {
    
    // Quality grades enum
    enum QualityGrade { A, B, C }
    
    // Order status enum
    enum OrderStatus { Created, Funded, Delivered, Completed, Disputed, Cancelled }
    
    // Order struct
    struct Order {
        string orderId;
        address payable seller;
        address payable buyer;
        uint256 quantity;
        QualityGrade agreedQualityGrade;
        uint256 basePrice;
        uint256 totalAmount;
        OrderStatus status;
        QualityGrade measuredQualityGrade;
        uint256 finalAmount;
        uint256 createdAt;
        uint256 deliveredAt;
        bool exists;
    }
    
    // Mapping from orderId to Order
    mapping(string => Order) public orders;
    
    // Mapping to track order IDs by buyer and seller
    mapping(address => string[]) public buyerOrders;
    mapping(address => string[]) public sellerOrders;
    
    // Contract owner
    address public owner;
    
    // Quality degradation matrix (in basis points, 10000 = 100%)
    // [fromGrade][toGrade] = percentage to pay
    mapping(QualityGrade => mapping(QualityGrade => uint256)) public degradationMatrix;
    
    // Events
    event OrderCreated(string indexed orderId, address indexed seller, address indexed buyer, uint256 totalAmount);
    event OrderFunded(string indexed orderId, uint256 amount);
    event OrderDelivered(string indexed orderId, QualityGrade measuredGrade, uint256 finalAmount);
    event OrderCompleted(string indexed orderId, uint256 sellerPaid, uint256 buyerRefund);
    event OrderCancelled(string indexed orderId, uint256 refundAmount);
    event OrderDisputed(string indexed orderId);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier orderExists(string memory orderId) {
        require(orders[orderId].exists, "Order does not exist");
        _;
    }
    
    modifier onlyBuyer(string memory orderId) {
        require(orders[orderId].buyer == msg.sender, "Only buyer can call this");
        _;
    }
    
    modifier onlySeller(string memory orderId) {
        require(orders[orderId].seller == msg.sender, "Only seller can call this");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        
        // Initialize degradation matrix
        // A -> A: 100% (10000 basis points)
        degradationMatrix[QualityGrade.A][QualityGrade.A] = 10000;
        // A -> B: 90% (-10%)
        degradationMatrix[QualityGrade.A][QualityGrade.B] = 9000;
        // A -> C: 75% (-25%)
        degradationMatrix[QualityGrade.A][QualityGrade.C] = 7500;
        
        // B -> A: 100% (upgrade, no penalty)
        degradationMatrix[QualityGrade.B][QualityGrade.A] = 10000;
        // B -> B: 100%
        degradationMatrix[QualityGrade.B][QualityGrade.B] = 10000;
        // B -> C: 85% (-15%)
        degradationMatrix[QualityGrade.B][QualityGrade.C] = 8500;
        
        // C -> A: 100% (upgrade, no penalty)
        degradationMatrix[QualityGrade.C][QualityGrade.A] = 10000;
        // C -> B: 100% (upgrade, no penalty)
        degradationMatrix[QualityGrade.C][QualityGrade.B] = 10000;
        // C -> C: 100%
        degradationMatrix[QualityGrade.C][QualityGrade.C] = 10000;
    }
    
    /**
     * @dev Create a new order with escrow
     * @param orderId Unique order identifier
     * @param seller Seller's address
     * @param buyer Buyer's address
     * @param quantity Quantity of product
     * @param agreedQualityGrade Agreed quality grade (0=A, 1=B, 2=C)
     * @param basePrice Base price per unit in wei
     */
    function createOrder(
        string memory orderId,
        address payable seller,
        address payable buyer,
        uint256 quantity,
        QualityGrade agreedQualityGrade,
        uint256 basePrice
    ) external payable {
        require(!orders[orderId].exists, "Order already exists");
        require(seller != address(0), "Invalid seller address");
        require(buyer != address(0), "Invalid buyer address");
        require(quantity > 0, "Quantity must be greater than 0");
        require(basePrice > 0, "Base price must be greater than 0");
        
        uint256 totalAmount = quantity * basePrice;
        require(msg.value >= totalAmount, "Insufficient payment");
        
        orders[orderId] = Order({
            orderId: orderId,
            seller: seller,
            buyer: buyer,
            quantity: quantity,
            agreedQualityGrade: agreedQualityGrade,
            basePrice: basePrice,
            totalAmount: totalAmount,
            status: OrderStatus.Funded,
            measuredQualityGrade: agreedQualityGrade, // Default to agreed
            finalAmount: 0,
            createdAt: block.timestamp,
            deliveredAt: 0,
            exists: true
        });
        
        buyerOrders[buyer].push(orderId);
        sellerOrders[seller].push(orderId);
        
        emit OrderCreated(orderId, seller, buyer, totalAmount);
        emit OrderFunded(orderId, msg.value);
        
        // Refund excess payment
        if (msg.value > totalAmount) {
            payable(msg.sender).transfer(msg.value - totalAmount);
        }
    }
    
    /**
     * @dev Finalize delivery with quality measurement
     * @param orderId Order identifier
     * @param measuredQualityGrade Measured quality grade from IoT (0=A, 1=B, 2=C)
     */
    function finalizeDelivery(
        string memory orderId,
        QualityGrade measuredQualityGrade
    ) external orderExists(orderId) {
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.Funded, "Order not in funded status");
        require(msg.sender == owner || msg.sender == order.buyer, "Unauthorized");
        
        order.measuredQualityGrade = measuredQualityGrade;
        order.deliveredAt = block.timestamp;
        order.status = OrderStatus.Delivered;
        
        // Calculate final amount based on degradation matrix
        uint256 paymentPercentage = degradationMatrix[order.agreedQualityGrade][measuredQualityGrade];
        order.finalAmount = (order.totalAmount * paymentPercentage) / 10000;
        
        emit OrderDelivered(orderId, measuredQualityGrade, order.finalAmount);
        
        // Automatically complete the order
        _completeOrder(orderId);
    }
    
    /**
     * @dev Internal function to complete order and transfer funds
     */
    function _completeOrder(string memory orderId) private {
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.Delivered, "Order not delivered");
        
        uint256 sellerPayment = order.finalAmount;
        uint256 buyerRefund = order.totalAmount - sellerPayment;
        
        order.status = OrderStatus.Completed;
        
        // Transfer payment to seller
        if (sellerPayment > 0) {
            order.seller.transfer(sellerPayment);
        }
        
        // Refund difference to buyer
        if (buyerRefund > 0) {
            order.buyer.transfer(buyerRefund);
        }
        
        emit OrderCompleted(orderId, sellerPayment, buyerRefund);
    }
    
    /**
     * @dev Cancel order and refund buyer (only before delivery)
     * @param orderId Order identifier
     */
    function cancelOrder(string memory orderId) external orderExists(orderId) {
        Order storage order = orders[orderId];
        require(
            msg.sender == order.buyer || msg.sender == order.seller || msg.sender == owner,
            "Unauthorized"
        );
        require(order.status == OrderStatus.Funded, "Cannot cancel order in current status");
        
        order.status = OrderStatus.Cancelled;
        
        // Refund full amount to buyer
        order.buyer.transfer(order.totalAmount);
        
        emit OrderCancelled(orderId, order.totalAmount);
    }
    
    /**
     * @dev Dispute an order (for manual resolution)
     * @param orderId Order identifier
     */
    function disputeOrder(string memory orderId) external orderExists(orderId) {
        Order storage order = orders[orderId];
        require(
            msg.sender == order.buyer || msg.sender == order.seller,
            "Only buyer or seller can dispute"
        );
        require(
            order.status == OrderStatus.Funded || order.status == OrderStatus.Delivered,
            "Cannot dispute order in current status"
        );
        
        order.status = OrderStatus.Disputed;
        emit OrderDisputed(orderId);
    }
    
    /**
     * @dev Resolve disputed order (owner only)
     * @param orderId Order identifier
     * @param sellerAmount Amount to pay to seller
     * @param buyerAmount Amount to refund to buyer
     */
    function resolveDispute(
        string memory orderId,
        uint256 sellerAmount,
        uint256 buyerAmount
    ) external onlyOwner orderExists(orderId) {
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.Disputed, "Order not disputed");
        require(sellerAmount + buyerAmount == order.totalAmount, "Amounts must sum to total");
        
        order.status = OrderStatus.Completed;
        order.finalAmount = sellerAmount;
        
        if (sellerAmount > 0) {
            order.seller.transfer(sellerAmount);
        }
        
        if (buyerAmount > 0) {
            order.buyer.transfer(buyerAmount);
        }
        
        emit OrderCompleted(orderId, sellerAmount, buyerAmount);
    }
    
    /**
     * @dev Get order details
     */
    function getOrder(string memory orderId) external view orderExists(orderId) returns (
        address seller,
        address buyer,
        uint256 quantity,
        QualityGrade agreedQualityGrade,
        uint256 basePrice,
        uint256 totalAmount,
        OrderStatus status,
        QualityGrade measuredQualityGrade,
        uint256 finalAmount,
        uint256 createdAt,
        uint256 deliveredAt
    ) {
        Order memory order = orders[orderId];
        return (
            order.seller,
            order.buyer,
            order.quantity,
            order.agreedQualityGrade,
            order.basePrice,
            order.totalAmount,
            order.status,
            order.measuredQualityGrade,
            order.finalAmount,
            order.createdAt,
            order.deliveredAt
        );
    }
    
    /**
     * @dev Get buyer's order IDs
     */
    function getBuyerOrders(address buyer) external view returns (string[] memory) {
        return buyerOrders[buyer];
    }
    
    /**
     * @dev Get seller's order IDs
     */
    function getSellerOrders(address seller) external view returns (string[] memory) {
        return sellerOrders[seller];
    }
    
    /**
     * @dev Update degradation matrix (owner only)
     */
    function updateDegradationMatrix(
        QualityGrade fromGrade,
        QualityGrade toGrade,
        uint256 percentage
    ) external onlyOwner {
        require(percentage <= 10000, "Percentage cannot exceed 100%");
        degradationMatrix[fromGrade][toGrade] = percentage;
    }
    
    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
