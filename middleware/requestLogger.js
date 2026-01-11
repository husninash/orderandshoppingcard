// middleware/requestLogger.js - Enhanced request logging

const fs = require('fs');
const path = require('path');

/**
 * Enhanced request logger middleware
 */
function requestLogger(req, res, next) {
    const startTime = Date.now();

    // Log request
    const requestLog = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
    };

    console.log(`[${requestLog.timestamp}] ${requestLog.method} ${requestLog.url}`);

    // Capture response
    const originalSend = res.send;
    res.send = function (data) {
        const duration = Date.now() - startTime;

        const responseLog = {
            ...requestLog,
            statusCode: res.statusCode,
            duration: `${duration}ms`
        };

        // Log to console
        console.log(`[${requestLog.timestamp}] ${requestLog.method} ${requestLog.url} - ${res.statusCode} (${duration}ms)`);

        // Write to file in production
        if (process.env.NODE_ENV === 'production') {
            const logDir = path.join(__dirname, '..', 'logs');
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir);
            }

            const logFile = path.join(logDir, `access-${new Date().toISOString().split('T')[0]}.log`);
            fs.appendFileSync(logFile, JSON.stringify(responseLog) + '\n');
        }

        originalSend.call(this, data);
    };

    next();
}

module.exports = requestLogger;
