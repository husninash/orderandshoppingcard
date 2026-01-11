// utils/errorHandler.js - Centralized error handling

/**
 * Custom Error Classes
 */
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

class ServiceUnavailableError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ServiceUnavailableError';
        this.statusCode = 503;
    }
}

/**
 * Format error response
 */
function formatErrorResponse(error) {
    return {
        success: false,
        error: {
            name: error.name,
            message: error.message,
            statusCode: error.statusCode || 500
        }
    };
}

/**
 * Log error with context
 */
function logError(error, context = {}) {
    console.error('='.repeat(50));
    console.error('Error occurred:', error.name);
    console.error('Message:', error.message);
    console.error('Status Code:', error.statusCode || 500);
    if (Object.keys(context).length > 0) {
        console.error('Context:', JSON.stringify(context, null, 2));
    }
    if (error.stack) {
        console.error('Stack:', error.stack);
    }
    console.error('='.repeat(50));
}

module.exports = {
    ValidationError,
    NotFoundError,
    ServiceUnavailableError,
    formatErrorResponse,
    logError
};
