const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
  updatePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(authorize('admin'), getUsers);
router
  .route('/:id')
  .get(authorize('admin'), getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

router.put('/me', updateProfile);
router.put('/me/password', updatePassword);

router
  .route('/me/address')
  .post(addAddress)
  .put('/:id', updateAddress)
  .delete('/:id', deleteAddress);

router.route('/me/wishlist').post(addToWishlist).delete('/:id', removeFromWishlist);

module.exports = router;