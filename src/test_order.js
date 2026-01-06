// src/test_order.js
const fetch = require('node-fetch');
const base = 'http://localhost:3003';
(async () => {
    try {
        // Add item to cart
        const addRes = await fetch(`${base}/api/cart/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Item A', price: 10, quantity: 2 })
        });
        const added = await addRes.json();
        console.log('Added to cart:', added);

        // Create order
        const orderRes = await fetch(`${base}/api/orders`, { method: 'POST' });
        const order = await orderRes.json();
        console.log('Created order:', order);

        // Retrieve order by ID
        const getRes = await fetch(`${base}/api/orders/${order.order_id}`);
        const fetched = await getRes.json();
        console.log('Fetched order:', fetched);
    } catch (err) {
        console.error('Error during test:', err);
    }
})();
