// src/cart.js
const express = require('express');
const router = express.Router();
const data = require('./data');

// POST /api/cart/add - add item to cart
router.post('/add', (req, res) => {
    const { name, price, quantity } = req.body;
    if (!name || typeof price !== 'number' || typeof quantity !== 'number') {
        return res.status(400).json({ error: 'Invalid item data' });
    }
    const item = data.addToCart({ name, price, quantity });
    res.status(201).json(item);
});

// GET /api/cart - retrieve current cart
router.get('/', (req, res) => {
    res.json(data.getCart());
});

// DELETE /api/cart/item/:id - remove item from cart
router.delete('/item/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const removed = data.removeFromCart(id);
    if (!removed) {
        return res.status(404).json({ error: 'Item not found' });
    }
    res.json(removed);
});

module.exports = router;
