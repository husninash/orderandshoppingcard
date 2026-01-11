# Changelog

All notable changes to Cart Service will be documented in this file.

## [1.0.0] - 2026-01-11

### Added
- Initial release of Cart Service
- RESTful API for shopping cart management
- Catalog Service integration for product validation
- UUID-based item identification
- Automatic subtotal and total calculations
- In-memory storage for rapid development
- Comprehensive API documentation
- Mermaid flow diagrams
- Health check endpoint
- CORS support
- Request logging middleware
- Error handling middleware
- Mock product fallback mechanism

### Features
- **POST /api/cart/add** - Add items to cart with validation
- **GET /api/cart** - Retrieve cart with calculated totals
- **DELETE /api/cart/remove/:item_id** - Remove specific items
- **DELETE /api/cart/clear** - Clear entire cart
- **GET /health** - Service health check

### Documentation
- Complete README with setup instructions
- API examples with cURL and PowerShell
- Architecture and flow diagrams
- Contributing guidelines
- Features and best practices documentation

### Technical Details
- Node.js with Express framework
- UUID for unique identifiers
- Axios for HTTP client
- Environment-based configuration
- Production-ready error handling

## [Planned]

### Future Enhancements
- Database integration (PostgreSQL/MySQL)
- User authentication and authorization
- Multi-user cart support
- Redis caching for sessions
- Comprehensive unit tests
- Integration tests
- Performance monitoring
- Rate limiting
- API versioning
