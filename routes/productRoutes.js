// const express = require('express');
// const {
//   getProducts,
//   getProduct,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   createProductReview,
//   getProductReviews,
//   deleteReview,
// } = require('../controllers/productController');
// const { protect, authorize } = require('../middleware/auth');
// const upload = require('../middleware/upload');

// const router = express.Router();

// router
//   .route('/')
//   .get(getProducts)
//   .post(protect, authorize('admin'), upload.array('images'), createProduct);

// router
//   .route('/:id')
//   .get(getProduct)
//   .put(protect, authorize('admin'), updateProduct)
//   .delete(protect, authorize('admin'), deleteProduct);

// router.route('/:id/reviews').get(getProductReviews).post(protect, createProductReview);
// router.route('/reviews').delete(protect, deleteReview);

// module.exports = router;








const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  generateUploadSignature,
  getMensProducts
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(createProduct);

router.get('/signature', generateUploadSignature);
router.route('/:id/reviews').post(createProductReview);
router.get('/top', getTopProducts);
router.get('/men', getMensProducts);
router
  .route('/:id')
  .get(getProductById)
  .delete(deleteProduct)
  .put(updateProduct);

module.exports = router;