// middleware/rateLimiter.js - Rate limiting middleware

const rateLimit = {};

/**
 * Simple in-memory rate limiter
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 */
function createRateLimiter(maxRequests = 100, windowMs = 60000) {
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        const now = Date.now();

        // Initialize if not exists
        if (!rateLimit[ip]) {
            rateLimit[ip] = {
                count: 0,
                resetTime: now + windowMs
            };
        }

        // Reset if window expired
        if (now > rateLimit[ip].resetTime) {
            rateLimit[ip] = {
                count: 0,
                resetTime: now + windowMs
            };
        }

        // Check limit
        if (rateLimit[ip].count >= maxRequests) {
            return res.status(429).json({
                success: false,
                error: 'Too many requests, please try again later',
                retryAfter: Math.ceil((rateLimit[ip].resetTime - now) / 1000)
            });
        }

        // Increment counter
        rateLimit[ip].count++;

        // Add rate limit headers
        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', maxRequests - rateLimit[ip].count);
        res.setHeader('X-RateLimit-Reset', new Date(rateLimit[ip].resetTime).toISOString());

        next();
    };
}

/**
 * Cleanup old entries periodically
 */
setInterval(() => {
    const now = Date.now();
    Object.keys(rateLimit).forEach(ip => {
        if (now > rateLimit[ip].resetTime) {
            delete rateLimit[ip];
        }
    });
}, 300000); // Cleanup every 5 minutes

module.exports = createRateLimiter;
