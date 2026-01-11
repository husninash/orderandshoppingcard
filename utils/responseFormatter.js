// utils/responseFormatter.js - Standardize API responses

/**
 * Success response formatter
 */
function successResponse(data, message = 'Success') {
    return {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    };
}

/**
 * Error response formatter
 */
function errorResponse(error, message = 'Error occurred') {
    return {
        success: false,
        message,
        error: {
            code: error.code || 'INTERNAL_ERROR',
            message: error.message
        },
        timestamp: new Date().toISOString()
    };
}

/**
 * Paginated response formatter
 */
function paginatedResponse(items, page, limit, total) {
    return {
        success: true,
        data: items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        },
        timestamp: new Date().toISOString()
    };
}

/**
 * Cart response formatter
 */
function cartResponse(cart, message = 'Cart retrieved successfully') {
    return {
        success: true,
        message,
        cart: {
            items: cart.items || [],
            total_items: cart.total_items || 0,
            total_price: cart.total_price || 0
        },
        timestamp: new Date().toISOString()
    };
}

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse,
    cartResponse
};
