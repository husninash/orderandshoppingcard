// tests/cart.test.js - Unit tests for Cart Service

const Cart = require('../models/Cart');

/**
 * Simple test runner
 */
function runTests() {
    console.log('🧪 Running Cart Service Tests...\n');

    let passedTests = 0;
    let failedTests = 0;

    // Test 1: Add item to cart
    try {
        Cart.clearCart();
        const productData = {
            product_id: 'P001',
            name: 'Test Product',
            price: 10000,
            stock: 10
        };

        const item = Cart.addItem(productData, 2);

        if (item.product_id === 'P001' && item.quantity === 2 && item.subtotal === 20000) {
            console.log('✅ Test 1: Add item to cart - PASSED');
            passedTests++;
        } else {
            throw new Error('Item data incorrect');
        }
    } catch (error) {
        console.log('❌ Test 1: Add item to cart - FAILED:', error.message);
        failedTests++;
    }

    // Test 2: Update quantity for existing item
    try {
        const productData = {
            product_id: 'P001',
            name: 'Test Product',
            price: 10000,
            stock: 10
        };

        const item = Cart.addItem(productData, 3);

        if (item.quantity === 5 && item.subtotal === 50000) {
            console.log('✅ Test 2: Update quantity - PASSED');
            passedTests++;
        } else {
            throw new Error('Quantity not updated correctly');
        }
    } catch (error) {
        console.log('❌ Test 2: Update quantity - FAILED:', error.message);
        failedTests++;
    }

    // Test 3: Get cart with totals
    try {
        const cart = Cart.getCart();

        if (cart.total_items === 5 && cart.total_price === 50000 && cart.items.length === 1) {
            console.log('✅ Test 3: Get cart with totals - PASSED');
            passedTests++;
        } else {
            throw new Error('Cart totals incorrect');
        }
    } catch (error) {
        console.log('❌ Test 3: Get cart with totals - FAILED:', error.message);
        failedTests++;
    }

    // Test 4: Remove item from cart
    try {
        const cart = Cart.getCart();
        const itemId = cart.items[0].item_id;

        const removed = Cart.removeItem(itemId);
        const updatedCart = Cart.getCart();

        if (removed && updatedCart.items.length === 0 && updatedCart.total_items === 0) {
            console.log('✅ Test 4: Remove item - PASSED');
            passedTests++;
        } else {
            throw new Error('Item not removed correctly');
        }
    } catch (error) {
        console.log('❌ Test 4: Remove item - FAILED:', error.message);
        failedTests++;
    }

    // Test 5: Clear cart
    try {
        Cart.addItem({ product_id: 'P002', name: 'Product 2', price: 5000, stock: 5 }, 1);
        Cart.clearCart();
        const cart = Cart.getCart();

        if (cart.items.length === 0 && cart.total_items === 0 && cart.total_price === 0) {
            console.log('✅ Test 5: Clear cart - PASSED');
            passedTests++;
        } else {
            throw new Error('Cart not cleared correctly');
        }
    } catch (error) {
        console.log('❌ Test 5: Clear cart - FAILED:', error.message);
        failedTests++;
    }

    // Test Summary
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Test Results:`);
    console.log(`   ✅ Passed: ${passedTests}`);
    console.log(`   ❌ Failed: ${failedTests}`);
    console.log(`   📈 Total:  ${passedTests + failedTests}`);
    console.log('='.repeat(50));

    return failedTests === 0;
}

// Run tests if executed directly
if (require.main === module) {
    const success = runTests();
    process.exit(success ? 0 : 1);
}

module.exports = { runTests };
