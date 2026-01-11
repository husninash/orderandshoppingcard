const Cart = require('../models/Cart');
const CatalogService = require('../services/catalogService');

class CartController {
    /**
     * POST /api/cart/add
     * Add item to cart
     */
    static async addToCart(req, res) {
        try {
            const { product_id, quantity } = req.body;

            // Validation
            if (!product_id) {
                return res.status(400).json({
                    success: false,
                    message: 'product_id is required'
                });
            }

            if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
                return res.status(400).json({
                    success: false,
                    message: 'quantity must be a positive integer'
                });
            }

            // Validate product via Catalog Service
            let productData;
            try {
                productData = await CatalogService.validateProduct(product_id);
            } catch (error) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            // Add item to cart
            const addedItem = Cart.addItem(productData, quantity);
            const cart = Cart.getCart();

            return res.status(201).json({
                success: true,
                message: 'Product added to cart',
                item: addedItem,
                cart: cart
            });

        } catch (error) {
            console.error('Error adding to cart:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * GET /api/cart
     * Get current cart with all items
     */
    static getCart(req, res) {
        try {
            const cart = Cart.getCart();

            return res.status(200).json({
                success: true,
                cart: cart
            });

        } catch (error) {
            console.error('Error getting cart:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * DELETE /api/cart/remove/:item_id
     * Remove item from cart
     */
    static removeFromCart(req, res) {
        try {
            const { item_id } = req.params;

            // Validation
            if (!item_id) {
                return res.status(400).json({
                    success: false,
                    message: 'item_id is required'
                });
            }

            // Check if item exists
            const item = Cart.findItemById(item_id);
            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found in cart'
                });
            }

            // Remove item
            const removed = Cart.removeItem(item_id);

            if (!removed) {
                return res.status(404).json({
                    success: false,
                    message: 'Failed to remove item'
                });
            }

            const cart = Cart.getCart();

            return res.status(200).json({
                success: true,
                message: 'Item removed from cart',
                cart: cart
            });

        } catch (error) {
            console.error('Error removing from cart:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * DELETE /api/cart/clear
     * Clear all items from cart
     */
    static clearCart(req, res) {
        try {
            Cart.clearCart();

            return res.status(200).json({
                success: true,
                message: 'Cart cleared',
                cart: {
                    items: [],
                    total_items: 0,
                    total_price: 0
                }
            });

        } catch (error) {
            console.error('Error clearing cart:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = CartController;
