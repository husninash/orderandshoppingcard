const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Order & Cart Service is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Order & Cart Service API',
        version: '2.0.0',
        features: [
            'Shopping Cart Management',
            'Product Catalog Integration',
            'Order Management',
            'Stock Validation'
        ],
        endpoints: {
            cart: {
                add: 'POST /api/cart/add - Add product to cart with stock validation',
                get: 'GET /api/cart - Get current cart',
                remove: 'DELETE /api/cart/remove/:item_id - Remove item from cart',
                clear: 'DELETE /api/cart/clear - Clear all items from cart'
            },
            orders: {
                create: 'POST /api/orders - Create order from cart',
                get_all: 'GET /api/orders - Get all orders',
                get_one: 'GET /api/orders/:order_id - Get order by ID',
                update_status: 'PATCH /api/orders/:order_id/status - Update order status'
            },
            health: 'GET /health - Health check'
        },
        documentation: {
            integration: '/docs/INTEGRASI_CATALOG_SERVICE.md',
            testing: '/docs/API_TESTING.md'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🛒 Cart Service Started');
    console.log('='.repeat(50));
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API docs: http://localhost:${PORT}/`);
    console.log('='.repeat(50));
});

module.exports = app;
