// src/data.js
// Simple in‑memory storage (for demo only)
let cart = [];
let orders = [];
let nextCartItemId = 1;
let nextOrderId = 1;

module.exports = {
    // Cart operations
    removeFromCart: (id) => {
        const index = cart.findIndex(item => item.id === id);
        if (index === -1) return null;
        const [removed] = cart.splice(index, 1);
        return removed;
    },
    getCart: () => cart,
    addToCart: ({ name, price, quantity }) => {
        const item = { id: nextCartItemId++, name, price, quantity };
        cart.push(item);
        return item;
    },
    clearCart: () => { cart = []; nextCartItemId = 1; },

    // Order operations
    createOrder: (items) => {
        const total_price = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const order = {
            order_id: `ORD-${nextOrderId++}`,
            status: 'WAITING_PAYMENT',
            total_price,
            items,
            created_at: new Date().toISOString()
        };
        orders.push(order);
        return order;
    },
    getOrderById: (orderId) => orders.find(o => o.order_id === orderId)
};
