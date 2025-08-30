// const express = require('express');
// const {
//   createOrder,
//   getSingleOrder,
//   myOrders,
//   getAllOrders,
//   updateOrder,
//   deleteOrder,
// } = require('../controllers/orderController');
// const { protect, authorize } = require('../middleware/auth');

// const router = express.Router();

// router.route('/').post(protect, createOrder).get(protect, authorize('admin'), getAllOrders);
// router.route('/me').get(protect, myOrders);
// router
//   .route('/:id')
//   .get(protect, getSingleOrder)
//   .put(protect, authorize('admin'), updateOrder)
//   .delete(protect, authorize('admin'), deleteOrder);

// module.exports = router;







const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(addOrderItems).get(getOrders);
router.route('/myorders').get(getMyOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/pay').put(updateOrderToPaid);
router.route('/:id/deliver').put(updateOrderToDelivered);

module.exports = router;