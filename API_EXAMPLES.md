# API Examples & Test Cases 🧪

Contoh lengkap request & response untuk semua endpoint Cart Service.

## ✅ Success Scenarios

### 1. Add First Item to Cart

**Request:**
```bash
curl -X POST http://localhost:3001/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "P001",
    "quantity": 2
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Product added to cart",
  "item": {
    "item_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "product_id": "P001",
    "name": "Laptop ASUS ROG",
    "price": 15000000,
    "quantity": 2,
    "subtotal": 30000000
  },
  "cart": {
    "items": [
      {
        "item_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "product_id": "P001",
        "name": "Laptop ASUS ROG",
        "price": 15000000,
        "quantity": 2,
        "subtotal": 30000000
      }
    ],
    "total_items": 2,
    "total_price": 30000000
  }
}
```

---

### 2. Add Another Product

**Request:**
```bash
curl -X POST http://localhost:3001/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "P002",
    "quantity": 1
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Product added to cart",
  "item": {
    "item_id": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
    "product_id": "P002",
    "name": "Mouse Logitech G502",
    "price": 750000,
    "quantity": 1,
    "subtotal": 750000
  },
  "cart": {
    "items": [
      {
        "item_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "product_id": "P001",
        "name": "Laptop ASUS ROG",
        "price": 15000000,
        "quantity": 2,
        "subtotal": 30000000
      },
      {
        "item_id": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
        "product_id": "P002",
        "name": "Mouse Logitech G502",
        "price": 750000,
        "quantity": 1,
        "subtotal": 750000
      }
    ],
    "total_items": 3,
    "total_price": 30750000
  }
}
```

---

### 3. Update Quantity (Add Same Product)

**Request:**
```bash
curl -X POST http://localhost:3001/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "P001",
    "quantity": 1
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Product added to cart",
  "item": {
    "item_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "product_id": "P001",
    "name": "Laptop ASUS ROG",
    "price": 15000000,
    "quantity": 3,
    "subtotal": 45000000
  },
  "cart": {
    "items": [
      {
        "item_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "product_id": "P001",
        "name": "Laptop ASUS ROG",
        "price": 15000000,
        "quantity": 3,
        "subtotal": 45000000
      },
      {
        "item_id": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
        "product_id": "P002",
        "name": "Mouse Logitech G502",
        "price": 750000,
        "quantity": 1,
        "subtotal": 750000
      }
    ],
    "total_items": 4,
    "total_price": 45750000
  }
}
```

---

### 4. Get Cart

**Request:**
```bash
curl http://localhost:3001/api/cart
```

**Response (200 OK):**
```json
{
  "success": true,
  "cart": {
    "items": [
      {
        "item_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "product_id": "P001",
        "name": "Laptop ASUS ROG",
        "price": 15000000,
        "quantity": 3,
        "subtotal": 45000000
      },
      {
        "item_id": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
        "product_id": "P002",
        "name": "Mouse Logitech G502",
        "price": 750000,
        "quantity": 1,
        "subtotal": 750000
      }
    ],
    "total_items": 4,
    "total_price": 45750000
  }
}
```

---

### 5. Get Empty Cart

**Request:**
```bash
curl http://localhost:3001/api/cart
```

**Response (200 OK):**
```json
{
  "success": true,
  "cart": {
    "items": [],
    "total_items": 0,
    "total_price": 0
  }
}
```

---

### 6. Remove Item from Cart

**Request:**
```bash
curl -X DELETE http://localhost:3001/api/cart/remove/b2c3d4e5-f6g7-8901-bcde-fg2345678901
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "cart": {
    "items": [
      {
        "item_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "product_id": "P001",
        "name": "Laptop ASUS ROG",
        "price": 15000000,
        "quantity": 3,
        "subtotal": 45000000
      }
    ],
    "total_items": 3,
    "total_price": 45000000
  }
}
```

---

### 7. Clear Cart

**Request:**
```bash
curl -X DELETE http://localhost:3001/api/cart/clear
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart cleared",
  "cart": {
    "items": [],
    "total_items": 0,
    "total_price": 0
  }
}
```

---

## ❌ Error Scenarios

### 1. Missing product_id

**Request:**
```bash
curl -X POST http://localhost:3001/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 2
  }'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "product_id is required"
}
```

---

### 2. Invalid Quantity (Zero)

**Request:**
```bash
curl -X POST http://localhost:3001/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "P001",
    "quantity": 0
  }'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "quantity must be a positive integer"
}
```

---

### 3. Invalid Quantity (Negative)

**Request:**
```bash
curl -X POST http://localhost:3001/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "P001",
    "quantity": -5
  }'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "quantity must be a positive integer"
}
```

---

### 4. Invalid Quantity (Decimal)

**Request:**
```bash
curl -X POST http://localhost:3001/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "P001",
    "quantity": 1.5
  }'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "quantity must be a positive integer"
}
```

---

### 5. Product Not Found

**Request:**
```bash
curl -X POST http://localhost:3001/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "INVALID_ID",
    "quantity": 1
  }'
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Product INVALID_ID not found in catalog"
}
```

---

### 6. Item Not Found in Cart

**Request:**
```bash
curl -X DELETE http://localhost:3001/api/cart/remove/invalid-uuid
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Item not found in cart"
}
```

---

### 7. Product Out of Stock

**Request:**
```bash
curl -X POST http://localhost:3001/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "P999",
    "quantity": 1
  }'
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Product out of stock"
}
```

---

## 🔗 Integration Flow: Cart → Order

### Complete User Journey

**Step 1: Add Products to Cart**
```bash
# Add Laptop
curl -X POST http://localhost:3001/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{"product_id": "P001", "quantity": 1}'

# Add Mouse
curl -X POST http://localhost:3001/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{"product_id": "P002", "quantity": 2}'
```

**Step 2: Get Cart (Verify)**
```bash
curl http://localhost:3001/api/cart
```

**Step 3: Create Order (via Order Service)**
```bash
# Order Service mengambil cart data dan create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"product_id": "P001", "name": "Laptop ASUS ROG", "price": 15000000, "quantity": 1},
      {"product_id": "P002", "name": "Mouse Logitech G502", "price": 750000, "quantity": 2}
    ]
  }'
```

**Response dari Order Service:**
```json
{
  "order_id": "O001",
  "status": "WAITING_PAYMENT",
  "total_price": 16500000
}
```

**Step 4: Clear Cart (After Order Created)**
```bash
curl -X DELETE http://localhost:3001/api/cart/clear
```

---

## 📦 Available Mock Products

Untuk testing (jika Catalog Service unavailable):

```javascript
{
  'P001': { product_id: 'P001', name: 'Laptop ASUS ROG', price: 15000000, stock: 10 },
  'P002': { product_id: 'P002', name: 'Mouse Logitech G502', price: 750000, stock: 25 },
  'P003': { product_id: 'P003', name: 'Keyboard Mechanical', price: 1200000, stock: 15 },
  'P004': { product_id: 'P004', name: 'Monitor LG 27"', price: 3500000, stock: 8 },
  'P005': { product_id: 'P005', name: 'Webcam Logitech C920', price: 1500000, stock: 20 }
}
```

## 🧪 Testing Checklist

- [ ] Add item dengan product_id valid
- [ ] Add item dengan quantity berbeda
- [ ] Add same product dua kali (verify quantity bertambah)
- [ ] Get cart (verify total calculation)
- [ ] Remove item by item_id
- [ ] Clear cart
- [ ] Error: missing product_id
- [ ] Error: invalid quantity (0, negative, decimal)
- [ ] Error: product_id tidak ditemukan
- [ ] Error: remove item_id yang tidak ada
- [ ] Integration: Cart → Order → Clear flow
