const axios = require('axios');

// Catalog Service base URL (configurable via environment variable)
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:3002';

class CatalogService {
    /**
     * Validate product exists and get product data from Catalog Service
     * @param {string} product_id - Product ID to validate
     * @returns {Promise<Object>} Product data {product_id, name, price, stock}
     * @throws {Error} If product not found or service unavailable
     */
    static async validateProduct(product_id) {
        try {
            // Call Catalog Service API
            const response = await axios.get(`${CATALOG_SERVICE_URL}/api/products/${product_id}`);

            if (response.data && response.data.success) {
                const product = response.data.product;

                // Check if product is available
                if (product.stock <= 0) {
                    throw new Error('Product out of stock');
                }

                return {
                    product_id: product.product_id || product.id,
                    name: product.name,
                    price: product.price,
                    stock: product.stock
                };
            }

            throw new Error('Product not found');
        } catch (error) {
            // Handle different error scenarios
            if (error.response) {
                // Catalog Service responded with error
                if (error.response.status === 404) {
                    throw new Error(`Product ${product_id} not found`);
                }
                throw new Error(`Catalog Service error: ${error.response.data.message || 'Unknown error'}`);
            } else if (error.request) {
                // No response from Catalog Service
                console.error('Catalog Service unavailable:', error.message);

                // For demo: return mock data if Catalog Service is down
                console.log('⚠️  Using mock product data (Catalog Service unavailable)');
                return this.getMockProduct(product_id);
            } else {
                // Other errors
                throw error;
            }
        }
    }

    /**
     * Mock product data for demo when Catalog Service is unavailable
     * @param {string} product_id - Product ID
     * @returns {Object} Mock product data
     */
    static getMockProduct(product_id) {
        // Mock product database for demo
        const mockProducts = {
            'P001': { product_id: 'P001', name: 'Laptop ASUS ROG', price: 15000000, stock: 10 },
            'P002': { product_id: 'P002', name: 'Mouse Logitech G502', price: 750000, stock: 25 },
            'P003': { product_id: 'P003', name: 'Keyboard Mechanical', price: 1200000, stock: 15 },
            'P004': { product_id: 'P004', name: 'Monitor LG 27"', price: 3500000, stock: 8 },
            'P005': { product_id: 'P005', name: 'Webcam Logitech C920', price: 1500000, stock: 20 }
        };

        const product = mockProducts[product_id];

        if (!product) {
            throw new Error(`Product ${product_id} not found in catalog`);
        }

        return product;
    }
}

module.exports = CatalogService;
