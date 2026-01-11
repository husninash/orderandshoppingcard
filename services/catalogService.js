const axios = require('axios');

// Catalog Service base URL (configurable via environment variable)
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:3002';

/**
 * Custom Error Classes untuk Catalog Service Communication
 */
class ProductNotFoundError extends Error {
    constructor(product_id) {
        super(`Product ${product_id} not found`);
        this.code = 'PRODUCT_NOT_FOUND';
        this.statusCode = 404;
    }
}

class InsufficientStockError extends Error {
    constructor(product_id, requested, available) {
        super(`Insufficient stock for product ${product_id}. Requested: ${requested}, Available: ${available}`);
        this.code = 'INSUFFICIENT_STOCK';
        this.statusCode = 400;
        this.details = { requested, available };
    }
}

class CatalogServiceUnavailableError extends Error {
    constructor(originalError) {
        super(`Catalog Service is unavailable: ${originalError.message}`);
        this.code = 'CATALOG_SERVICE_UNAVAILABLE';
        this.statusCode = 503;
    }
}

class CatalogService {
    /**
     * Validate product exists and get product data from Catalog Service
     * @param {string} product_id - Product ID to validate
     * @returns {Promise<Object>} Product data {product_id, name, price, stock, sku, category}
     * @throws {ProductNotFoundError|CatalogServiceUnavailableError}
     */
    static async validateProduct(product_id) {
        try {
            console.log(`[CatalogService] Validating product: ${product_id}`);
            
            // Call Catalog Service API
            const response = await axios.get(
                `${CATALOG_SERVICE_URL}/api/products/${product_id}`,
                { timeout: 5000 } // 5 second timeout
            );

            if (response.data && response.data.success) {
                const product = response.data.product;

                console.log(`[CatalogService] Product found: ${product.name} (Stock: ${product.stock})`);

                return {
                    product_id: product.product_id || product.id,
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    sku: product.sku || null,
                    category: product.category || null
                };
            }

            throw new ProductNotFoundError(product_id);
        } catch (error) {
            return this.handleCatalogError(error, product_id);
        }
    }

    /**
     * Validate product AND check stock availability
     * @param {string} product_id - Product ID
     * @param {number} quantity - Quantity needed
     * @returns {Promise<Object>} Product data if stock available
     * @throws {ProductNotFoundError|InsufficientStockError|CatalogServiceUnavailableError}
     */
    static async validateProductWithStock(product_id, quantity) {
        const product = await this.validateProduct(product_id);
        
        if (product.stock < quantity) {
            throw new InsufficientStockError(product_id, quantity, product.stock);
        }
        
        return product;
    }

    /**
     * Get product info (without stock validation)
     * @param {string} product_id - Product ID
     * @returns {Promise<Object>} Product data
     */
    static async getProductInfo(product_id) {
        try {
            const response = await axios.get(
                `${CATALOG_SERVICE_URL}/api/products/${product_id}`,
                { timeout: 5000 }
            );

            if (response.data && response.data.success) {
                return response.data.product;
            }

            throw new ProductNotFoundError(product_id);
        } catch (error) {
            return this.handleCatalogError(error, product_id);
        }
    }

    /**
     * Check stock availability for a product
     * @param {string} product_id - Product ID
     * @param {number} quantity - Quantity to check
     * @returns {Promise<boolean>} True if enough stock available
     */
    static async checkStockAvailability(product_id, quantity) {
        try {
            const product = await this.validateProduct(product_id);
            return product.stock >= quantity;
        } catch (error) {
            if (error instanceof ProductNotFoundError) {
                return false;
            }
            throw error;
        }
    }

    /**
     * Get product price
     * @param {string} product_id - Product ID
     * @returns {Promise<number>} Product price
     */
    static async getProductPrice(product_id) {
        const product = await this.validateProduct(product_id);
        return product.price;
    }

    /**
     * Validate multiple products at once (batch validation)
     * @param {Array<{product_id, quantity}>} items - Items to validate
     * @returns {Promise<Array>} Array of validated products
     * @throws Error if any product validation fails
     */
    static async validateMultipleProducts(items) {
        const validatedProducts = [];
        
        for (const item of items) {
            const product = await this.validateProductWithStock(item.product_id, item.quantity);
            validatedProducts.push(product);
        }
        
        return validatedProducts;
    }

    /**
     * Handle errors from Catalog Service communication
     * @private
     */
    static handleCatalogError(error, product_id) {
        console.error(`[CatalogService] Error communicating with Catalog Service:`, error.message);

        // Handle different error scenarios
        if (error.response) {
            // Catalog Service responded with error
            if (error.response.status === 404) {
                throw new ProductNotFoundError(product_id);
            }
            
            const errorMessage = error.response.data?.message || 'Unknown error';
            throw new Error(`Catalog Service error: ${errorMessage}`);
        } else if (error.request) {
            // No response from Catalog Service
            console.error('Catalog Service unavailable:', error.message);

            // For demo: return mock data if Catalog Service is down
            console.log('⚠️  Using mock product data (Catalog Service unavailable)');
            return this.getMockProduct(product_id);
        } else if (error instanceof ProductNotFoundError || error instanceof InsufficientStockError) {
            // Re-throw our custom errors
            throw error;
        } else {
            // Other errors
            throw new CatalogServiceUnavailableError(error);
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

// Export error classes for use in controllers
module.exports.ProductNotFoundError = ProductNotFoundError;
module.exports.InsufficientStockError = InsufficientStockError;
module.exports.CatalogServiceUnavailableError = CatalogServiceUnavailableError;
