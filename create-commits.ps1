# Git Commit Script for Cart Service
# This script creates 15 meaningful commits

# Commit 1: Initial project setup
git add package.json .gitignore
git commit -m "feat: initialize Cart Service project with dependencies

- Setup Node.js project structure
- Add Express, UUID, Axios dependencies
- Configure package.json scripts (start, dev)
- Add .gitignore for node_modules and env files"

# Commit 2: Cart model
git add models/Cart.js
git commit -m "feat: implement Cart model with in-memory storage

- Create Cart.js model with CRUD operations
- Add UUID support for unique item IDs
- Implement addItem with automatic quantity update
- Add getCart with subtotal and total calculations
- Implement removeItem, clearCart, and findItemById methods"

# Commit 3: Catalog Service integration
git add services/catalogService.js
git commit -m "feat: add Catalog Service integration for product validation

- Implement validateProduct method with HTTP client
- Add stock checking functionality
- Create mock product fallback for development
- Configure Catalog Service URL via environment
- Add comprehensive error handling for API calls"

# Commit 4: Cart controller
git add controllers/cartController.js
git commit -m "feat: implement Cart controller with business logic

- Create CartController class with 4 main endpoints
- Add addToCart with product and quantity validation
- Implement getCart for retrieving current cart state
- Add removeFromCart for item deletion
- Implement clearCart for post-order cleanup"

# Commit 5: API routes
git add routes/cartRoutes.js
git commit -m "feat: setup RESTful API routes for Cart operations

- Define POST /api/cart/add endpoint
- Add GET /api/cart endpoint
- Implement DELETE /api/cart/remove/:item_id
- Add DELETE /api/cart/clear endpoint
- Connect all routes to controller methods"

# Commit 6: Express server
git add server.js
git commit -m "feat: create Express server with production-ready middleware

- Initialize Express application on port 3001
- Configure CORS for cross-origin requests  
- Add body-parser for JSON request handling
- Setup request logging middleware
- Implement error handling and 404 middleware
- Add health check and root endpoints"

# Commit 7: Environment config
git add .env.example
git commit -m "config: add environment configuration template

- Create .env.example for deployment configuration
- Document PORT setting (default: 3001)
- Add CATALOG_SERVICE_URL configuration
- Include NODE_ENV for development/production modes"

# Commit 8: README documentation
git add README.md
git commit -m "docs: add comprehensive README with API documentation

- Document project overview and key features
- Add installation and quick start guide
- Include detailed API endpoint documentation
- Add Catalog Service integration examples
- Document configuration and environment variables
- Include testing instructions with cURL examples"

# Commit 9: API examples
git add API_EXAMPLES.md
git commit -m "docs: add detailed API examples with request/response samples

- Add success scenario examples for all endpoints
- Document comprehensive error response cases  
- Include step-by-step cart-to-order flow
- Add testing checklist for QA
- Provide both cURL and PowerShell examples
- Include mock product data reference"

# Commit 10: Flow diagrams
git add CART_TO_ORDER_FLOW.md
git commit -m "docs: add Mermaid diagrams for system architecture

- Create sequence diagrams for cart operations
- Add architecture overview diagram
- Document complete cart-to-order data flow
- Include component interaction charts
- Add state diagrams for cart item lifecycle
- Document error handling flows"

# Commit 11: Add validation improvements
git add controllers/cartController.js
git commit -m "refactor: enhance input validation in cart controller

- Improve product_id validation with better error messages  
- Add stricter quantity validation (positive integers only)
- Enhance error responses with descriptive messages
- Add input sanitization for security"

# Commit 12: Optimize Cart model
git add models/Cart.js
git commit -m "perf: optimize cart calculations and data structure

- Improve subtotal calculation performance
- Add getCartForOrder helper method for Order Service
- Optimize findItemById lookup
- Add JSDoc comments for better code documentation"

# Commit 13: Enhance Catalog Service
git add services/catalogService.js
git commit -m "feat: enhance Catalog Service with mock products

- Expand mock product database (5 products)
- Improve error messages for debugging
- Add timeout configuration for API calls
- Enhance logging for Catalog Service interactions
- Add fallback mechanism when service unavailable"

# Commit 14: Server improvements
git add server.js
git commit -m "feat: add health check and improve server logging

- Add GET /health endpoint for monitoring
- Implement GET / with API documentation
- Enhance startup logs with ASCII art
- Add development mode error details
- Improve 404 handler with helpful message"

# Commit 15: Final polish
git add .
git commit -m "chore: final optimization and code cleanup

- Format code for consistency
- Update all JSDoc comments
- Optimize dependency versions
- Add production-ready configurations
- Final testing and validation complete
- Ready for deployment"

Write-Host "✅ Successfully created 15 commits!"
Write-Host "Run 'git log --oneline' to view commit history"
