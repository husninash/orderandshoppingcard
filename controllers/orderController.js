const Cart = require('../models/Cart');
const CatalogService = require('../services/catalogService');
const { ProductNotFoundError, InsufficientStockError } = require('../services/catalogService');
const { v4: uuidv4 } = require('uuid');

// In-memory order storage (replace with database in production)
let orders = [];

class OrderController {
    /**
     * POST /api/orders
     * Create order from cart with complete validation
     * 
     * Response format:
     * {
     *   "success": true,
     *   "message": "Order created successfully",
     *   "order": {
     *     "order_id": "ORD-xxx",
     *     "status": "PENDING",
     *     "items": [...],
     *     "total_price": 50000,
     *     "created_at": "2026-01-11T..."
     *   }
     * }
     */
    static async createOrder(req, res) {
        try {
            const cartItems = Cart.getCart().items;

            // Validation: check if cart is empty
            if (!cartItems || cartItems.length === 0) {
                return res.status(400).json({
                    success: false,
                    code: 'EMPTY_CART',
                    message: 'Cannot create order from empty cart'
                });
            }

            console.log(`[OrderController] Creating order with ${cartItems.length} items`);

            // Validate all products and stock before creating order
            const validationErrors = [];
            const validatedItems = [];

            for (const item of cartItems) {
                try {
                    // Validate product with stock
                    const product = await CatalogService.validateProductWithStock(
                        item.product_id,
                        item.quantity
                    );
                    
                    validatedItems.push({
                        product_id: item.product_id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        sku: product.sku,
                        category: product.category
                    });
                    
                    console.log(`[OrderController] ✓ Item validated: ${item.product_id}`);
                } catch (error) {
                    if (error instanceof ProductNotFoundError) {
                        validationErrors.push({
                            product_id: item.product_id,
                            code: 'PRODUCT_NOT_FOUND',
                            message: error.message
                        });
                    } else if (error instanceof InsufficientStockError) {
                        validationErrors.push({
                            product_id: item.product_id,
                            code: 'INSUFFICIENT_STOCK',
                            message: error.message,
                            requested: item.quantity,
                            available: error.details.available
                        });
                    } else {
                        validationErrors.push({
                            product_id: item.product_id,
                            code: 'VALIDATION_ERROR',
                            message: error.message
                        });
                    }
                }
            }

            // If any validation errors, return them all
            if (validationErrors.length > 0) {
                console.error('[OrderController] Validation errors found:', validationErrors);
                return res.status(400).json({
                    success: false,
                    code: 'VALIDATION_FAILED',
                    message: `Order validation failed. ${validationErrors.length} item(s) have issues.`,
                    errors: validationErrors
                });
            }

            // All items validated - create order
            const order = {
                order_id: `ORD-${uuidv4().substring(0, 8).toUpperCase()}`,
                status: 'PENDING',
                items: validatedItems,
                total_items: validatedItems.reduce((sum, item) => sum + item.quantity, 0),
                total_price: validatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            orders.push(order);
            
            // Clear cart after successful order creation
            Cart.clearCart();

            console.log(`[OrderController] Order created successfully: ${order.order_id}`);

            return res.status(201).json({
                success: true,
                message: 'Order created successfully',
                order: order
            });

        } catch (error) {
            console.error('[OrderController] Error creating order:', error);
            return res.status(500).json({
                success: false,
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * GET /api/orders/:order_id
     * Get order details by order ID
     */
    static getOrder(req, res) {
        try {
            const { order_id } = req.params;

            if (!order_id) {
                return res.status(400).json({
                    success: false,
                    code: 'MISSING_ORDER_ID',
                    message: 'order_id is required'
                });
            }

            const order = orders.find(o => o.order_id === order_id);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    code: 'ORDER_NOT_FOUND',
                    message: `Order ${order_id} not found`
                });
            }

            return res.status(200).json({
                success: true,
                order: order
            });

        } catch (error) {
            console.error('[OrderController] Error getting order:', error);
            return res.status(500).json({
                success: false,
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * GET /api/orders
     * Get all orders
     */
    static getAllOrders(req, res) {
        try {
            return res.status(200).json({
                success: true,
                total: orders.length,
                orders: orders
            });

        } catch (error) {
            console.error('[OrderController] Error getting orders:', error);
            return res.status(500).json({
                success: false,
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * PATCH /api/orders/:order_id/status
     * Update order status
     * 
     * Request body:
     * {
     *   "status": "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
     * }
     */
    static updateOrderStatus(req, res) {
        try {
            const { order_id } = req.params;
            const { status } = req.body;

            if (!order_id) {
                return res.status(400).json({
                    success: false,
                    code: 'MISSING_ORDER_ID',
                    message: 'order_id is required'
                });
            }

            if (!status) {
                return res.status(400).json({
                    success: false,
                    code: 'MISSING_STATUS',
                    message: 'status is required'
                });
            }

            const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    code: 'INVALID_STATUS',
                    message: `Status must be one of: ${validStatuses.join(', ')}`
                });
            }

            const order = orders.find(o => o.order_id === order_id);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    code: 'ORDER_NOT_FOUND',
                    message: `Order ${order_id} not found`
                });
            }

            order.status = status;
            order.updated_at = new Date().toISOString();

            return res.status(200).json({
                success: true,
                message: 'Order status updated successfully',
                order: order
            });

        } catch (error) {
            console.error('[OrderController] Error updating order status:', error);
            return res.status(500).json({
                success: false,
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = OrderController;
