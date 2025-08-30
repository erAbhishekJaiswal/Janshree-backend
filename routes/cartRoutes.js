const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

// Get cart
router.get('/', cartController.getCart);

// Add item to cart
router.post('/add', cartController.addToCart);

// Update cart item
router.put('/update/:itemId', cartController.updateCartItem);

// Remove item from cart
router.delete('/remove/:itemId', cartController.removeFromCart);

// Clear cart
// router.delete('/clear', cartController.clearCart);

module.exports = router;