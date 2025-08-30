// const express = require('express');
// const { processPayment, verifyPayment } = require('../controllers/paymentController');
// const { protect } = require('../middleware/auth');

// const router = express.Router();

// router.post('/process', protect, processPayment);
// router.post('/verify', protect, verifyPayment);

// module.exports = router;




const express = require('express');
const router = express.Router();
const {
  createPayment,
  updatePaymentStatus,
  getPaymentById,
  getPayments
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post( createPayment)
  .get(getPayments);
router.route('/:id')
  .get(getPaymentById);
router.route('/:id/status')
  .put(updatePaymentStatus);

module.exports = router;