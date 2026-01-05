# Cart to Order Flow 📊

Dokumentasi diagram dan flow untuk integrasi Cart Service dengan Order Service dan Catalog Service.

## Architecture Overview

```mermaid
graph LR
    Client[Client/User] --> CartService[Cart Service<br/>:3001]
    Client --> OrderService[Order Service<br/>:3000]
    CartService --> CatalogService[Catalog Service<br/>:3002]
    OrderService --> CartService
    
    style CartService fill:#4CAF50,color:#fff
    style OrderService fill:#2196F3,color:#fff
    style CatalogService fill:#FF9800,color:#fff
```

---

## Sequence Diagram: Add to Cart Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Cart Service
    participant Cat as Catalog Service
    
    U->>C: POST /api/cart/add<br/>{product_id, quantity}
    
    Note over C: Validate input
    
    C->>Cat: GET /api/products/{product_id}
    
    alt Product Found
        Cat-->>C: {product_id, name, price, stock}
        
        Note over C: Check if product<br/>already in cart
        
        alt Product exists in cart
            Note over C: Update quantity<br/>quantity += new_quantity
        else New product
            Note over C: Add new item<br/>with UUID
        end
        
        Note over C: Calculate subtotal<br/>price × quantity
        
        C-->>U: 201 Created<br/>{item, cart}
        
    else Product Not Found
        Cat-->>C: 404 Not Found
        C-->>U: 404 Product not found
    end
```

---

## Sequence Diagram: Complete Cart → Order Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Cart Service
    participant O as Order Service
    participant Cat as Catalog Service
    
    Note over U,Cat: Step 1: Build Cart
    
    U->>C: POST /api/cart/add<br/>{product_id: "P001", quantity: 2}
    C->>Cat: Validate Product P001
    Cat-->>C: Product data
    C-->>U: Item added to cart
    
    U->>C: POST /api/cart/add<br/>{product_id: "P002", quantity: 1}
    C->>Cat: Validate Product P002
    Cat-->>C: Product data
    C-->>U: Item added to cart
    
    Note over U,Cat: Step 2: View Cart
    
    U->>C: GET /api/cart
    C-->>U: Cart with all items<br/>total_price calculated
    
    Note over U,Cat: Step 3: Create Order
    
    U->>O: POST /api/orders<br/>(with cart items)
    
    Note over O: Generate order_id<br/>Set status: WAITING_PAYMENT<br/>Calculate total_price
    
    O-->>U: Order created<br/>{order_id, status, total_price}
    
    Note over U,Cat: Step 4: Clear Cart
    
    U->>C: DELETE /api/cart/clear
    C-->>U: Cart cleared
    
    Note over U,Cat: Step 5: Process Payment
    
    U->>O: Update payment status
    O-->>U: Order status updated
```

---

## Data Flow Diagram

```mermaid
flowchart TB
    Start([User wants to shop]) --> AddToCart[Add Product to Cart]
    
    AddToCart --> ValidateProduct{Validate Product<br/>via Catalog Service}
    
    ValidateProduct -->|Invalid| ShowError1[Show Error:<br/>Product not found]
    ValidateProduct -->|Valid| CheckExisting{Product already<br/>in cart?}
    
    CheckExisting -->|Yes| UpdateQty[Update Quantity<br/>qty += new_qty]
    CheckExisting -->|No| AddNew[Add New Item<br/>with UUID]
    
    UpdateQty --> CalcSubtotal[Calculate Subtotal<br/>price × quantity]
    AddNew --> CalcSubtotal
    
    CalcSubtotal --> ReturnCart[Return Updated Cart]
    
    ReturnCart --> UserDecision{User Action}
    
    UserDecision -->|Add More| AddToCart
    UserDecision -->|View Cart| GetCart[GET /api/cart]
    UserDecision -->|Remove Item| RemoveItem[DELETE /api/cart/remove/:id]
    UserDecision -->|Checkout| CreateOrder[Create Order]
    
    GetCart --> UserDecision
    RemoveItem --> UserDecision
    
    CreateOrder --> OrderService[Order Service<br/>POST /api/orders]
    OrderService --> GenerateOrder[Generate order_id<br/>Set WAITING_PAYMENT<br/>Calculate total]
    GenerateOrder --> ClearCart[Clear Cart<br/>DELETE /api/cart/clear]
    ClearCart --> End([Order Created])
    
    ShowError1 --> End
    
    style AddToCart fill:#4CAF50,color:#fff
    style CreateOrder fill:#2196F3,color:#fff
    style ValidateProduct fill:#FF9800,color:#fff
    style OrderService fill:#2196F3,color:#fff
```

---

## Component Interaction Diagram

```mermaid
graph TB
    subgraph "Cart Service :3001"
        CR[Cart Routes] --> CC[Cart Controller]
        CC --> CM[Cart Model<br/>In-Memory Storage]
        CC --> CS[Catalog Service Client]
    end
    
    subgraph "Order Service :3000"
        OR[Order Routes] --> OC[Order Controller]
        OC --> OM[Order Model]
    end
    
    subgraph "Catalog Service :3002"
        PR[Product Routes] --> PC[Product Controller]
        PC --> PM[Product Model]
    end
    
    User[User/Client] -->|POST /api/cart/add| CR
    User -->|GET /api/cart| CR
    User -->|DELETE /api/cart/remove| CR
    
    CS -->|GET /api/products/:id| PR
    
    User -->|POST /api/orders| OR
    OC -->|Get cart data| CR
    OC -->|Clear cart| CR
    
    style CR fill:#4CAF50,color:#fff
    style CC fill:#4CAF50,color:#fff
    style CM fill:#4CAF50,color:#fff
    style OR fill:#2196F3,color:#fff
    style OC fill:#2196F3,color:#fff
    style PR fill:#FF9800,color:#fff
```

---

## State Diagram: Cart Item Lifecycle

```mermaid
stateDiagram-v2
    [*] --> NotInCart: User browsing
    
    NotInCart --> InCart: Add product<br/>(POST /cart/add)
    
    InCart --> InCart: Update quantity<br/>(Add same product)
    
    InCart --> NotInCart: Remove item<br/>(DELETE /cart/remove)
    
    InCart --> OrderPending: Create order<br/>(POST /orders)
    
    OrderPending --> [*]: Cart cleared<br/>(DELETE /cart/clear)
    
    NotInCart --> [*]: User leaves
```

---

## Data Transformation: Cart → Order

### Cart Service Output

```json
{
  "cart": {
    "items": [
      {
        "item_id": "uuid-1",
        "product_id": "P001",
        "name": "Laptop ASUS ROG",
        "price": 15000000,
        "quantity": 1,
        "subtotal": 15000000
      },
      {
        "item_id": "uuid-2",
        "product_id": "P002",
        "name": "Mouse Logitech G502",
        "price": 750000,
        "quantity": 2,
        "subtotal": 1500000
      }
    ],
    "total_items": 3,
    "total_price": 16500000
  }
}
```

### ⬇️ Transformation

Order Service transforms cart items ke order format:

### Order Service Input

```json
{
  "items": [
    {
      "product_id": "P001",
      "name": "Laptop ASUS ROG",
      "price": 15000000,
      "quantity": 1
    },
    {
      "product_id": "P002",
      "name": "Mouse Logitech G502",
      "price": 750000,
      "quantity": 2
    }
  ]
}
```

### Order Service Output

```json
{
  "order_id": "O001",
  "items": [...],
  "total_price": 16500000,
  "status": "WAITING_PAYMENT",
  "created_at": "2026-01-05T12:00:00.000Z",
  "updated_at": "2026-01-05T12:00:00.000Z"
}
```

---

## Integration Endpoints Summary

| Service | Endpoint | Method | Purpose |
|---------|----------|--------|---------|
| **Cart Service** | `/api/cart/add` | POST | Add item to cart |
| **Cart Service** | `/api/cart` | GET | Get cart data |
| **Cart Service** | `/api/cart/remove/:id` | DELETE | Remove item |
| **Cart Service** | `/api/cart/clear` | DELETE | Clear all items |
| **Catalog Service** | `/api/products/:id` | GET | Validate product |
| **Order Service** | `/api/orders` | POST | Create order from cart |
| **Order Service** | `/api/orders/:id` | GET | Get order details |

---

## Error Handling Flow

```mermaid
flowchart TD
    AddItem[POST /api/cart/add] --> ValidateInput{Input Valid?}
    
    ValidateInput -->|No product_id| Error400A[400: product_id required]
    ValidateInput -->|Invalid quantity| Error400B[400: quantity must be positive integer]
    ValidateInput -->|Valid| CallCatalog[Call Catalog Service]
    
    CallCatalog --> CatalogResponse{Catalog Response}
    
    CatalogResponse -->|404| Error404[404: Product not found]
    CatalogResponse -->|Out of stock| Error404B[404: Product out of stock]
    CatalogResponse -->|Service down| UseMock[Use Mock Data<br/>for Demo]
    CatalogResponse -->|Success| AddToCart[Add/Update Cart Item]
    
    UseMock --> AddToCart
    AddToCart --> Success201[201: Item added to cart]
    
    Error400A --> End([Error Response])
    Error400B --> End
    Error404 --> End
    Error404B --> End
    Success201 --> End([Success Response])
    
    style Error400A fill:#f44336,color:#fff
    style Error400B fill:#f44336,color:#fff
    style Error404 fill:#f44336,color:#fff
    style Error404B fill:#f44336,color:#fff
    style Success201 fill:#4CAF50,color:#fff
```

---

## Business Logic: Calculate Subtotal

```mermaid
flowchart LR
    Product[Product Data<br/>from Catalog] --> GetPrice[Get Price]
    Input[User Input] --> GetQty[Get Quantity]
    
    GetPrice --> Calc[Calculate Subtotal]
    GetQty --> Calc
    
    Calc --> Result[Subtotal = Price × Quantity]
    Result --> Store[Store in Cart Item]
    
    style Calc fill:#2196F3,color:#fff
    style Result fill:#4CAF50,color:#fff
```

**Formula:**
```
subtotal = price × quantity
total_price = Σ(subtotal for all items)
total_items = Σ(quantity for all items)
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Web[Web Browser]
        Mobile[Mobile App]
    end
    
    subgraph "API Layer"
        LB[Load Balancer]
    end
    
    subgraph "Service Layer (Port 3001)"
        CS1[Cart Service<br/>Instance 1]
        CS2[Cart Service<br/>Instance 2]
    end
    
    subgraph "External Services"
        Catalog[Catalog Service :3002]
        Order[Order Service :3000]
    end
    
    subgraph "Storage Layer"
        Memory[In-Memory Storage<br/>Demo]
        DB[(Database<br/>Production)]
    end
    
    Web --> LB
    Mobile --> LB
    
    LB --> CS1
    LB --> CS2
    
    CS1 --> Memory
    CS2 --> Memory
    
    CS1 -.Upgrade.-> DB
    CS2 -.Upgrade.-> DB
    
    CS1 --> Catalog
    CS2 --> Catalog
    
    Order --> CS1
    Order --> CS2
    
    style CS1 fill:#4CAF50,color:#fff
    style CS2 fill:#4CAF50,color:#fff
    style Memory fill:#FFC107,color:#000
    style DB fill:#2196F3,color:#fff
```

---

## Summary

### Key Points

1. **Cart Service** berjalan di port **3001**
2. **Validasi produk** dilakukan via **Catalog Service** (port 3002)
3. **Cart data** dapat diambil oleh **Order Service** (port 3000)
4. **Subtotal** auto-calculated untuk setiap item
5. **In-memory storage** untuk demo, mudah upgrade ke database
6. **Error handling** comprehensive untuk semua scenarios

### Integration Flow

```
User → Cart Service → Catalog Service (validate)
                    → Order Service (checkout)
                    → Clear Cart
```
