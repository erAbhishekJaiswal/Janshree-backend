const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    await user.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/me
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update password
// @route   PUT /api/v1/users/me/password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Add address
// @route   POST /api/v1/users/me/address
// @access  Private
exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    user.addresses.push(req.body);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.addresses,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update address
// @route   PUT /api/v1/users/me/address/:id
// @access  Private
exports.updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const addressIndex = user.addresses.findIndex(
      (address) => address._id.toString() === req.params.id
    );

    if (addressIndex === -1) {
      return next(
        new ErrorResponse(`Address not found with id of ${req.params.id}`, 404)
      );
    }

    user.addresses[addressIndex] = req.body;
    await user.save();

    res.status(200).json({
      success: true,
      data: user.addresses,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete address
// @route   DELETE /api/v1/users/me/address/:id
// @access  Private
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const addressIndex = user.addresses.findIndex(
      (address) => address._id.toString() === req.params.id
    );

    if (addressIndex === -1) {
      return next(
        new ErrorResponse(`Address not found with id of ${req.params.id}`, 404)
      );
    }

    user.addresses.splice(addressIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.addresses,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add to wishlist
// @route   POST /api/v1/users/me/wishlist
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.wishlist.includes(req.body.productId)) {
      return next(new ErrorResponse('Product already in wishlist', 400));
    }

    user.wishlist.push(req.body.productId);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.wishlist,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/v1/users/me/wishlist/:id
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const productIndex = user.wishlist.findIndex(
      (product) => product.toString() === req.params.id
    );

    if (productIndex === -1) {
      return next(
        new ErrorResponse(`Product not found in wishlist with id of ${req.params.id}`, 404)
      );
    }

    user.wishlist.splice(productIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.wishlist,
    });
  } catch (err) {
    next(err);
  }
};