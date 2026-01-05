const { v4: uuidv4 } = require('uuid');

// In-memory cart storage
let cartItems = [];

class Cart {
  /**
   * Add item to cart or update quantity if already exists
   * @param {Object} productData - Product data from Catalog Service
   * @param {number} quantity - Quantity to add
   * @returns {Object} Updated cart item
   */
  static addItem(productData, quantity) {
    // Check if product already in cart
    const existingItem = cartItems.find(item => item.product_id === productData.product_id);
    
    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.price * existingItem.quantity;
      return existingItem;
    }
    
    // Add new item
    const newItem = {
      item_id: uuidv4(),
      product_id: productData.product_id,
      name: productData.name,
      price: productData.price,
      quantity: quantity,
      subtotal: productData.price * quantity
    };
    
    cartItems.push(newItem);
    return newItem;
  }

  /**
   * Get all cart items with calculated totals
   * @returns {Object} Cart with items and totals
   */
  static getCart() {
    const items = cartItems.map(item => ({
      ...item,
      subtotal: item.price * item.quantity
    }));
    
    const total_items = items.reduce((sum, item) => sum + item.quantity, 0);
    const total_price = items.reduce((sum, item) => sum + item.subtotal, 0);
    
    return {
      items,
      total_items,
      total_price
    };
  }

  /**
   * Remove item from cart by item_id
   * @param {string} item_id - UUID of cart item
   * @returns {boolean} Success status
   */
  static removeItem(item_id) {
    const index = cartItems.findIndex(item => item.item_id === item_id);
    
    if (index === -1) {
      return false;
    }
    
    cartItems.splice(index, 1);
    return true;
  }

  /**
   * Clear all items from cart (used by Order Service after order created)
   * @returns {void}
   */
  static clearCart() {
    cartItems = [];
  }

  /**
   * Get cart data formatted for Order Service
   * @returns {Array} Cart items formatted for order
   */
  static getCartForOrder() {
    return cartItems.map(item => ({
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));
  }

  /**
   * Find item by item_id
   * @param {string} item_id - UUID of cart item
   * @returns {Object|null} Cart item or null
   */
  static findItemById(item_id) {
    return cartItems.find(item => item.item_id === item_id) || null;
  }
}

module.exports = Cart;
