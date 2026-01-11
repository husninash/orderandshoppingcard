const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

/**
 * Order Routes
 * Base URL: /api/orders
 */

// POST /api/orders - Create new order from cart
router.post('/', OrderController.createOrder);

// GET /api/orders - Get all orders
router.get('/', OrderController.getAllOrders);

// GET /api/orders/:order_id - Get order by ID
router.get('/:order_id', OrderController.getOrder);

// PATCH /api/orders/:order_id/status - Update order status
router.patch('/:order_id/status', OrderController.updateOrderStatus);

module.exports = router;
