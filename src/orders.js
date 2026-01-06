// src/orders.js
const express = require('express');
const router = express.Router();
const data = require('./data');

// POST /api/orders - create an order from current cart
router.post('/', (req, res) => {
    const items = data.getCart();
    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty, cannot create order' });
    }
    const order = data.createOrder(items);
    // clear cart after order creation
    data.clearCart();
    res.status(201).json(order);
});

// GET /api/orders/:id - retrieve order details by order_id
router.get('/:id', (req, res) => {
    const orderId = req.params.id;
    const order = data.getOrderById(orderId);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
});

module.exports = router;
