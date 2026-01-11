// config/constants.js - Application constants

module.exports = {
    // Server configuration
    SERVER: {
        PORT: process.env.PORT || 3001,
        HOST: 'localhost',
        ENV: process.env.NODE_ENV || 'development'
    },

    // External services
    SERVICES: {
        CATALOG_URL: process.env.CATALOG_SERVICE_URL || 'http://localhost:3002',
        ORDER_URL: process.env.ORDER_SERVICE_URL || 'http://localhost:3000'
    },

    // Cart limits
    CART: {
        MAX_ITEMS: 50,
        MAX_QUANTITY_PER_ITEM: 100,
        MIN_QUANTITY: 1
    },

    // API rate limiting
    RATE_LIMIT: {
        MAX_REQUESTS: 100,
        WINDOW_MS: 60000 // 1 minute
    },

    // HTTP status codes
    STATUS_CODES: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_ERROR: 500,
        SERVICE_UNAVAILABLE: 503
    },

    // Error codes
    ERROR_CODES: {
        VALIDATION_ERROR: 'VALIDATION_ERROR',
        PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
        ITEM_NOT_FOUND: 'ITEM_NOT_FOUND',
        CART_EMPTY: 'CART_EMPTY',
        CATALOG_UNAVAILABLE: 'CATALOG_UNAVAILABLE',
        INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK'
    },

    // Success messages
    MESSAGES: {
        PRODUCT_ADDED: 'Product added to cart',
        ITEM_REMOVED: 'Item removed from cart',
        CART_CLEARED: 'Cart cleared successfully',
        CART_RETRIEVED: 'Cart retrieved successfully'
    }
};
