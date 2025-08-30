// const express = require('express');
// const {
//   register,
//   login,
//   getMe,
//   forgotPassword,
//   resetPassword,
// } = require('../controllers/authController');
// const { protect } = require('../middleware/auth');

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);
// router.get('/me', protect, getMe);
// router.post('/forgotpassword', forgotPassword);
// router.put('/resetpassword/:resettoken', resetPassword);

// module.exports = router;










const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,getAllUsers
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// router.route('/').post(registerUser).get(protect, admin, getUsers);
// router.post('/login', authUser);
// router
//   .route('/profile')
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile);
// router
//   .route('/:id')
//   .delete(protect, admin, deleteUser)
//   .get(protect, admin, getUserById)
//   .put(protect, admin, updateUser);

router.post('/', registerUser);
router.get('/', getUsers)
router.get('/all',getAllUsers)
router.post('/login', authUser);
router.get('/profile', getUserProfile)
router.put('/', updateUserProfile)
router.delete('/:id', deleteUser)
router.get('/:id', getUserById)
router.put('/:id', updateUser)

module.exports = router;