// const ErrorResponse = require('../utils/errorResponse');
// const crypto = require('crypto');
// const Razorpay = require('razorpay');

// const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_API_KEY,
//   key_secret: process.env.RAZORPAY_API_SECRET,
// });

// // @desc    Process payment
// // @route   POST /api/v1/payment/process
// // @access  Private
// exports.processPayment = async (req, res, next) => {
//   try {
//     const options = {
//       amount: Number(req.body.amount * 100), // amount in smallest currency unit (paise)
//       currency: 'INR',
//     };

//     const order = await instance.orders.create(options);

//     res.status(200).json({
//       success: true,
//       order,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Verify payment
// // @route   POST /api/v1/payment/verify
// // @access  Private
// exports.verifyPayment = async (req, res, next) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//       req.body;

//     const body = razorpay_order_id + '|' + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
//       .update(body.toString())
//       .digest('hex');

//     const isAuthentic = expectedSignature === razorpay_signature;

//     if (!isAuthentic) {
//       return next(new ErrorResponse('Payment verification failed', 400));
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Payment verified successfully',
//       paymentId: razorpay_payment_id,
//       orderId: razorpay_order_id,
//     });
//   } catch (err) {
//     next(err);
//   }
// };








const Payment = require('../models/Payment');
const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');

// @desc    Create payment
// @route   POST /api/payments
// @access  Private
const createPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentMethod, amount } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const payment = new Payment({
    order: orderId,
    user: "68a405e33d41d1f1a99756a7", //req.user._id,
    paymentMethod,
    amount,
    status: 'pending'
  });

  const createdPayment = await payment.save();
  res.status(201).json(createdPayment);
});

// @desc    Update payment status
// @route   PUT /api/payments/:id/status
// @access  Private/Admin
// Completed
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  payment.status = status;
  const updatedPayment = await payment.save();

  // If payment is completed, update the associated order
  if (status === 'completed') {
    const order = await Order.findById(payment.order);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      await order.save();
    }
  }

  res.json(updatedPayment);
});

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
// Completed
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('order user');

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  // Ensure the user requesting is the owner or admin
  // if (payment.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
  //   res.status(401);
  //   throw new Error('Not authorized');
  // }

  res.json(payment);
});

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin
// Completed
const getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({}).populate('order user');
  res.json(payments);
});

module.exports = {
  createPayment,
  updatePaymentStatus,
  getPaymentById,
  getPayments
};