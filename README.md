# Shopping Cart Service 🛒

**Kelompok 3 - Order & Shopping Cart Service**

REST API service untuk mengelola shopping cart dengan validasi produk dari Catalog Service dan integrasi dengan Order Service.

## 📋 Features

- ✅ Add item to cart dengan validasi produk
- ✅ View cart dengan subtotal per item
- ✅ Remove item from cart
- ✅ Clear cart (untuk Order Service)
- ✅ Integrasi dengan Catalog Service untuk validasi produk
- ✅ In-memory storage (mudah upgrade ke database)
- ✅ RESTful API dengan JSON response

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 atau lebih baru)
- npm

### Installation

```bash
# Clone atau navigate ke project directory
cd OrderandShoppingCartService

# Install dependencies
npm install

# Start server
npm start
```

Server akan berjalan di: **http://localhost:3001**

### Development Mode

```bash
# Run dengan auto-reload (nodemon)
npm run dev
```

## 📡 API Endpoints

### 1. Add Item to Cart
**POST** `/api/cart/add`

Menambah item ke cart atau update quantity jika produk sudah ada.

**Request Body:**
```json
{
  "product_id": "P001",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product added to cart",
  "item": {
    "item_id": "uuid-here",
    "product_id": "P001",
    "name": "Laptop ASUS ROG",
    "price": 15000000,
    "quantity": 2,
    "subtotal": 30000000
  },
  "cart": {
    "items": [...],
    "total_items": 2,
    "total_price": 30000000
  }
}
```

---

### 2. Get Cart
**GET** `/api/cart`

Melihat semua item di cart dengan total.

**Response:**
```json
{
  "success": true,
  "cart": {
    "items": [
      {
        "item_id": "uuid-1",
        "product_id": "P001",
        "name": "Laptop ASUS ROG",
        "price": 15000000,
        "quantity": 2,
        "subtotal": 30000000
      },
      {
        "item_id": "uuid-2",
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

### 3. Remove Item from Cart
**DELETE** `/api/cart/remove/:item_id`

Menghapus item tertentu dari cart.

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "cart": {
    "items": [...],
    "total_items": 1,
    "total_price": 15000000
  }
}
```

---

### 4. Clear Cart
**DELETE** `/api/cart/clear`

Menghapus semua item dari cart (digunakan Order Service setelah order dibuat).

**Response:**
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

### 5. Health Check
**GET** `/health`

Mengecek status service.

**Response:**
```json
{
  "success": true,
  "message": "Cart Service is running",
  "timestamp": "2026-01-05T12:00:00.000Z"
}
```

## 🔗 Integration

### Catalog Service Integration

Cart Service melakukan validasi produk dengan memanggil Catalog Service:

**Endpoint:** `GET {CATALOG_SERVICE_URL}/api/products/{product_id}`

**Environment Variable:**
```bash
CATALOG_SERVICE_URL=http://localhost:3002
```

Jika Catalog Service tidak tersedia, service akan menggunakan mock data untuk demo.

### Order Service Integration

Order Service dapat mengambil cart data untuk membuat order:

```javascript
// Get cart data
const cartResponse = await axios.get('http://localhost:3001/api/cart');
const cartData = cartResponse.data.cart;

// Create order dengan cart data
const orderResponse = await axios.post('http://localhost:3000/api/orders', {
  items: cartData.items
});

// Clear cart after order created
await axios.delete('http://localhost:3001/api/cart/clear');
```

## 🏗️ Project Structure

```
OrderandShoppingCartService/
├── package.json              # Dependencies & scripts
├── server.js                 # Express server entry point
├── models/
│   └── Cart.js              # Cart data model (in-memory)
├── services/
│   └── catalogService.js    # Catalog Service integration
├── controllers/
│   └── cartController.js    # Business logic
└── routes/
    └── cartRoutes.js        # Route definitions
```

## 🛠️ Configuration

### Environment Variables

Create `.env` file (optional):

```env
PORT=3001
CATALOG_SERVICE_URL=http://localhost:3002
NODE_ENV=development
```

## 📊 Data Models

### Cart Item Schema

```javascript
{
  item_id: String,      // UUID
  product_id: String,   // Reference ke Catalog
  name: String,         // Product name
  price: Number,        // Product price (snapshot)
  quantity: Number,     // Quantity di cart
  subtotal: Number      // Calculated: price × quantity
}
```

## ✅ Validation

### Input Validation
- `product_id`: Required, must exist in Catalog
- `quantity`: Required, positive integer
- `item_id`: Required for remove operation

### Business Rules
- Product harus valid (cek via Catalog Service)
- Quantity harus > 0
- Jika produk sudah ada, quantity akan di-update (ditambah)
- Subtotal auto-calculated: price × quantity

## 🧪 Testing

### Manual Testing dengan cURL

**1. Add item to cart:**
```bash
curl -X POST http://localhost:3001/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{"product_id": "P001", "quantity": 2}'
```

**2. Get cart:**
```bash
curl http://localhost:3001/api/cart
```

**3. Remove item:**
```bash
curl -X DELETE http://localhost:3001/api/cart/remove/{item_id}
```

Lihat [API_EXAMPLES.md](API_EXAMPLES.md) untuk contoh lengkap.

## 📝 Next Steps (Production)

Untuk production deployment:

1. **Database Integration**: Replace in-memory storage dengan PostgreSQL/MySQL
2. **Authentication**: Add user authentication & authorization
3. **User Sessions**: Support multiple users dengan cart per user
4. **Validation**: Enhanced error handling & input validation
5. **Caching**: Redis untuk cart sessions
6. **Monitoring**: Add logging & monitoring (Winston, Morgan)
7. **Testing**: Unit & integration tests

## 👥 Team

**Kelompok 3** - Order & Shopping Cart Service
- Tanggung Jawab: Keranjang belanja, Pembuatan order, Integrasi katalog & pembayaran

## 📄 License

ISC
