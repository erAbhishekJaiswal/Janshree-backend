// const Order = require('../models/Order');
// const Product = require('../models/Product');
// const ErrorResponse = require('../utils/errorResponse');

// // @desc    Create new order
// // @route   POST /api/v1/orders
// // @access  Private
// exports.createOrder = async (req, res, next) => {
//   try {
//     const {
//       orderItems,
//       shippingInfo,
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice,
//       paymentInfo,
//     } = req.body;

//     const order = await Order.create({
//       orderItems,
//       shippingInfo,
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice,
//       paymentInfo,
//       user: req.user._id,
//     });

//     res.status(201).json({
//       success: true,
//       order,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Get single order
// // @route   GET /api/v1/orders/:id
// // @access  Private
// exports.getSingleOrder = async (req, res, next) => {
//   try {
//     const order = await Order.findById(req.params.id).populate(
//       'user',
//       'name email'
//     );

//     if (!order) {
//       return next(
//         new ErrorResponse(`No order found with id of ${req.params.id}`, 404)
//       );
//     }

//     // Make sure user is order owner or admin
//     if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
//       return next(
//         new ErrorResponse(
//           `User ${req.user.id} is not authorized to access this order`,
//           401
//         )
//       );
//     }

//     res.status(200).json({
//       success: true,
//       order,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Get logged in user orders
// // @route   GET /api/v1/orders/me
// // @access  Private
// exports.myOrders = async (req, res, next) => {
//   try {
//     const orders = await Order.find({ user: req.user.id });

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Get all orders
// // @route   GET /api/v1/orders
// // @access  Private/Admin
// exports.getAllOrders = async (req, res, next) => {
//   try {
//     const orders = await Order.find().populate('user', 'name email');

//     let totalAmount = 0;
//     orders.forEach((order) => {
//       totalAmount += order.totalPrice;
//     });

//     res.status(200).json({
//       success: true,
//       totalAmount,
//       count: orders.length,
//       orders,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Update order status
// // @route   PUT /api/v1/orders/:id
// // @access  Private/Admin
// exports.updateOrder = async (req, res, next) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return next(
//         new ErrorResponse(`No order found with id of ${req.params.id}`, 404)
//       );
//     }

//     if (order.orderStatus === 'Delivered') {
//       return next(new ErrorResponse('You have already delivered this order', 400));
//     }

//     // Update product stock
//     if (req.body.status === 'Shipped') {
//       order.orderItems.forEach(async (item) => {
//         await updateStock(item.product, item.quantity);
//       });
//     }

//     order.orderStatus = req.body.status;

//     if (req.body.status === 'Delivered') {
//       order.deliveredAt = Date.now();
//     }

//     await order.save({ validateBeforeSave: false });

//     res.status(200).json({
//       success: true,
//       order,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// async function updateStock(id, quantity) {
//   const product = await Product.findById(id);

//   product.stock = product.stock - quantity;

//   await product.save({ validateBeforeSave: false });
// }

// // @desc    Delete order
// // @route   DELETE /api/v1/orders/:id
// // @access  Private/Admin
// exports.deleteOrder = async (req, res, next) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return next(
//         new ErrorResponse(`No order found with id of ${req.params.id}`, 404)
//       );
//     }

//     await order.remove();

//     res.status(200).json({
//       success: true,
//       data: {},
//     });
//   } catch (err) {
//     next(err);
//   }
// };








const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// const addOrderItems = asyncHandler(async (req, res) => {
//   const {
//     orderItems,
//     shippingAddress,
//     paymentMethod,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice
//   } = req.body;

//   if (orderItems && orderItems.length === 0) {
//     res.status(400);
//     throw new Error('No order items');
//   } else {
//     const order = new Order({
//       orderItems,
//       user: req.user._id,
//       shippingAddress,
//       paymentMethod,
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice
//     });

//     const createdOrder = await order.save();
//     res.status(201).json(createdOrder);
//   }
// });

// Completed
 const addOrderItems = asyncHandler(async (req, res) => {
  try {
    const userId = "68a405e33d41d1f1a99756a7"; // replace with req.user.id after auth
    const { shippingAddress, paymentMethod } = req.body;

    // Find user cart
    // const cart = await Cart.findOne({ user: userId }).populate("items.product");
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    // console.log(cart);
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate prices
    const itemsPrice = cart.items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const taxPrice = (0.1 * itemsPrice).toFixed(2); // 10% tax (example)
    const shippingPrice = itemsPrice > 500 ? 0 : 50; // free shipping over ₹500
    const totalPrice = (Number(itemsPrice) + Number(taxPrice) + Number(shippingPrice)).toFixed(2);

    const pro = cart.items.map((i) => ({
        product: i.product._id,
        name: i.name,
        image: i.image,
        price: i.price,
        qty: i.qty,
      }))
    console.log(pro);
    

    // Create order
    const order = new Order({
      user: userId,
      orderItems: cart.items.map((i) => ({
        product: i.product._id,
        name: i.name,
        image: i.image,
        price: i.price,
        qty: i.qty,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Reduce stock for each product
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock -= item.qty;
        await product.save();
      }
    }

    // Empty cart after order placed
    cart.items = [];
    await cart.save();

    res.status(201).json({createdOrder, cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
// Completed
const getOrderById = asyncHandler(async (req, res) => {

  const order = await Order.findById(req.params.id)
  .populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
// Completed
const getMyOrders = asyncHandler(async (req, res) => {
  const userId = "68a405e33d41d1f1a99756a7" // req.user._id; // Assuming req.user is populated with user info
  if (!userId) {  
    res.status(401);
    throw new Error('Not authorized, no user found');
  }
  const orders = await Order.find({ user: userId }).populate('user', 'id name');
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
// Completed
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
  .populate('user', 'id name');
  res.json(orders);
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders
};