# Additional Features Documentation

## Mock Products Available

The Cart Service includes mock products for testing when Catalog Service is unavailable:

| Product ID | Product Name | Price (IDR) | Stock |
|-----------|--------------|-------------|-------|
| P001 | Laptop ASUS ROG | 15,000,000 | 10 |
| P002 | Mouse Logitech G502 | 750,000 | 25 |
| P003 | Keyboard Mechanical | 1,200,000 | 15 |
| P004 | Monitor LG 27" | 3,500,000 | 8 |
| P005 | Webcam Logitech C920 | 1,500,000 | 20 |

## Performance Considerations

- In-memory storage is fast for development
- For production, migrate to PostgreSQL or MySQL
- Consider Redis for session management
- Implement caching for frequently accessed products

## Security Best Practices

- Always validate input on server-side
- Use environment variables for sensitive data
- Implement rate limiting to prevent abuse
- Use HTTPS in production
- Sanitize all user inputs

## Monitoring & Logging

- Use `/health` endpoint for uptime monitoring
- Request logging includes timestamps and methods
- Error logging captures stack traces in development
- Consider Winston or Morgan for production logging
