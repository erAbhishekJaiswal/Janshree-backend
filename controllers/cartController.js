const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add item to cart
// exports.addToCart = async (req, res) => {
//     try {
//         const { productId, quantity } = req.body;
//         const userId = "68a405e33d41d1f1a99756a7"; //req.user.id;

//         const product = await Product.findById(productId);
//         if (!product) return res.status(404).json({ message: 'Product not found' });

//         let cart = await Cart.findOne({ user: userId });
//         if (!cart) {
//             cart = new Cart({ user: userId, items: [] });
//         }

//         const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
//         if (itemIndex > -1) {
//             cart.items[itemIndex].quantity += quantity;
//         } else {
//             cart.items.push({ product: productId, quantity });
//         }

//         await cart.save();
//         res.status(200).json(cart);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
// completed
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = "68a405e33d41d1f1a99756a7"; // Replace with req.user.id if auth is added

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            // Product already in cart, update quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // New item, push with all required fields
            cart.items.push({
                product: productId,
                name: product.name,
                image: product.images[0].url,
                price: product.price,
                quantity: quantity
            });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Get user's cart
// Completed
exports.getCart = async (req, res) => {
    try {
        const userId = "68a405e33d41d1f1a99756a7" // req.user.id;
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Remove item from cart
// Completed
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = "68a405e33d41d1f1a99756a7"; // req.user.id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update item quantity in cart
// Completed
exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = "68a405e33d41d1f1a99756a7"; // req.user.id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

        cart.items[itemIndex].qty = quantity;
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};