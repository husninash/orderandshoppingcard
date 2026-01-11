const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');

// Cart routes
router.post('/add', CartController.addToCart);
router.get('/', CartController.getCart);
router.delete('/remove/:item_id', CartController.removeFromCart);
router.delete('/clear', CartController.clearCart);

module.exports = router;
