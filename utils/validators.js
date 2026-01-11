// utils/validators.js - Input validation utilities

/**
 * Validate product ID format
 */
function validateProductId(product_id) {
    if (!product_id || typeof product_id !== 'string') {
        return {
            valid: false,
            error: 'product_id must be a non-empty string'
        };
    }

    // Check format (e.g., P001, P002)
    const productIdPattern = /^P\d{3,}$/;
    if (!productIdPattern.test(product_id)) {
        return {
            valid: false,
            error: 'product_id must follow format: P### (e.g., P001)'
        };
    }

    return { valid: true };
}

/**
 * Validate quantity
 */
function validateQuantity(quantity) {
    if (quantity === undefined || quantity === null) {
        return {
            valid: false,
            error: 'quantity is required'
        };
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
        return {
            valid: false,
            error: 'quantity must be a positive integer'
        };
    }

    if (quantity > 100) {
        return {
            valid: false,
            error: 'quantity cannot exceed 100 items'
        };
    }

    return { valid: true };
}

/**
 * Validate UUID format
 */
function validateUUID(uuid) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuid || !uuidPattern.test(uuid)) {
        return {
            valid: false,
            error: 'Invalid UUID format'
        };
    }

    return { valid: true };
}

/**
 * Sanitize input string
 */
function sanitizeString(input) {
    if (typeof input !== 'string') return input;

    // Remove potentially dangerous characters
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and >
        .substring(0, 255); // Limit length
}

module.exports = {
    validateProductId,
    validateQuantity,
    validateUUID,
    sanitizeString
};
