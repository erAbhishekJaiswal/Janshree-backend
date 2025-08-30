// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     orderItems: [
//       {
//         name: {
//           type: String,
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//         },
//         image: {
//           type: String,
//           required: true,
//         },
//         price: {
//           type: Number,
//           required: true,
//         },
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Product',
//           required: true,
//         },
//       },
//     ],
//     shippingInfo: {
//       address: {
//         type: String,
//         required: true,
//       },
//       city: {
//         type: String,
//         required: true,
//       },
//       state: {
//         type: String,
//         required: true,
//       },
//       country: {
//         type: String,
//         required: true,
//       },
//       zipCode: {
//         type: String,
//         required: true,
//       },
//       phoneNo: {
//         type: String,
//         required: true,
//       },
//     },
//     paymentInfo: {
//       id: {
//         type: String,
//         required: true,
//       },
//       status: {
//         type: String,
//         required: true,
//       },
//     },
//     itemsPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },
//     taxPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },
//     shippingPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },
//     totalPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },
//     orderStatus: {
//       type: String,
//       required: true,
//       default: 'Processing',
//     },
//     deliveredAt: {
//       type: Date,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Order', orderSchema);






const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["COD", "Razorpay", "Stripe", "Paypal"],
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
