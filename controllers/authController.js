// const User = require('../models/User');
// const ErrorResponse = require('../utils/errorResponse');
// const sendEmail = require('../utils/sendEmail');
// const crypto = require('crypto');
// const { generateToken } = require('../utils/generateToken');

// // @desc    Register user
// // @route   POST /api/v1/auth/register
// // @access  Public
// exports.register = async (req, res, next) => {
//   const { name, email, password } = req.body;

//   try {
//     const user = await User.create({
//       name,
//       email,
//       password,
//     });

//     sendTokenResponse(user, 200, res);
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Login user
// // @route   POST /api/v1/auth/login
// // @access  Public
// exports.login = async (req, res, next) => {
//   const { email, password } = req.body;

//   // Validate email & password
//   if (!email || !password) {
//     return next(new ErrorResponse('Please provide an email and password', 400));
//   }

//   // Check for user
//   const user = await User.findOne({ email }).select('+password');

//   if (!user) {
//     return next(new ErrorResponse('Invalid credentials', 401));
//   }

//   // Check if password matches
//   const isMatch = await user.matchPassword(password);

//   if (!isMatch) {
//     return next(new ErrorResponse('Invalid credentials', 401));
//   }

//   sendTokenResponse(user, 200, res);
// };

// // @desc    Get current logged in user
// // @route   GET /api/v1/auth/me
// // @access  Private
// exports.getMe = async (req, res, next) => {
//   const user = await User.findById(req.user.id);

//   res.status(200).json({
//     success: true,
//     data: user,
//   });
// };

// // @desc    Forgot password
// // @route   POST /api/v1/auth/forgotpassword
// // @access  Public
// exports.forgotPassword = async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     return next(new ErrorResponse('There is no user with that email', 404));
//   }

//   // Get reset token
//   const resetToken = user.getResetPasswordToken();

//   await user.save({ validateBeforeSave: false });

//   // Create reset url
//   const resetUrl = `${req.protocol}://${req.get(
//     'host'
//   )}/api/v1/auth/resetpassword/${resetToken}`;

//   const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: 'Password reset token',
//       message,
//     });

//     res.status(200).json({ success: true, data: 'Email sent' });
//   } catch (err) {
//     console.log(err);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save({ validateBeforeSave: false });

//     return next(new ErrorResponse('Email could not be sent', 500));
//   }
// };

// // @desc    Reset password
// // @route   PUT /api/v1/auth/resetpassword/:resettoken
// // @access  Public
// exports.resetPassword = async (req, res, next) => {
//   // Get hashed token
//   const resetPasswordToken = crypto
//     .createHash('sha256')
//     .update(req.params.resettoken)
//     .digest('hex');

//   const user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() },
//   });

//   if (!user) {
//     return next(new ErrorResponse('Invalid token', 400));
//   }

//   // Set new password
//   user.password = req.body.password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;
//   await user.save();

//   sendTokenResponse(user, 200, res);
// };

// // Get token from model, create cookie and send response
// const sendTokenResponse = (user, statusCode, res) => {
//   // Create token
//   const token = generateToken(user._id);

//   const options = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//   };

//   if (process.env.NODE_ENV === 'production') {
//     options.secure = true;
//   }

//   res
//     .status(statusCode)
//     .cookie('token', token, options)
//     .json({
//       success: true,
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         isAdmin: user.isAdmin,
//       },
//     });
// };










const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // check
  if(!user){
    res.status(400).json({
      message: "user not found"
    })
  } 

  res.status(200).json({
    message:"user login succsesfully",
    // user,
    _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      wishlist: user.wishlist,
      addresses: user.addresses,
      token: generateToken(user._id)
  })

});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.id);

  if (!user){
    res.status(400).json({
      message:"user profile dose not found"
    })
  }
  res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });

  // if (user) {
  //   res.json({
  //     _id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     isAdmin: user.isAdmin
  //   });
  // } else {
  //   res.status(404);
  //   throw new Error('User not found');
  // }
});


// const updateUserProfile = asyncHandler(async (req, res) => {
//   const userId = req.params.id;

//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(400).json({
//       message: "Invalid user ID"
//     });
//   }

//   const user = await User.findByIdAndUpdate(userId, req.body, {
//     new: true,
//     runValidators: true
//   });

//   if (!user) {
//     return res.status(404).json({
//       message: "User not found"
//     });
//   }

//   res.status(200).json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     isAdmin: user.isAdmin
//   });
// });


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.body.id);
  const user = await User.findByIdAndUpdate(req.body.id, req.body, {
    new: true,
    runValidators: true
  })  ;
  // const updated =await User.findByIdAndUpdate(req.body.id ,)

  if (!user) {
    res.status(400).json({
      message: "user profile dose not found"
    });
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin
  });

  // if (user) {
  //   user.name = req.body.name || user.name;
  //   user.email = req.body.email || user.email;
  //   // if (req.body.password) {
  //   //   user.password = req.body.password;
  //   // }

  //   const updatedUser = await user.save();

  //   res.status(200).json({
  //     _id: updatedUser._id,
  //     name: updatedUser.name,
  //     email: updatedUser.email,
  //     isAdmin: updatedUser.isAdmin,
  //     token: generateToken(updatedUser._id)
  //   });
  // } else {
  //   res.status(404);
  //   throw new Error('User not found');
  // }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// get users list with pagination
const getAllUsers = asyncHandler(async (req, res) => {
  // Read query params, with defaults
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  // Count total users
  const count = await User.countDocuments();

  // Fetch users with skip & limit
  const users = await User.find({})
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    users,
    count,             // total number of users
    page,              // current page
    pages: Math.ceil(count / limit), // total pages
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getAllUsers
};