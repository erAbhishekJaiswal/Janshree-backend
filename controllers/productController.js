// const Product = require('../models/Product');
// const ErrorResponse = require('../utils/errorResponse');
// const ApiFeatures = require('../utils/apiFeatures');

// // @desc    Get all products
// // @route   GET /api/v1/products
// // @access  Public
// exports.getProducts = async (req, res, next) => {
//   try {
//     // Number of products per page
//     const resPerPage = 8;
//     const productsCount = await Product.countDocuments();

//     const apiFeatures = new ApiFeatures(Product.find(), req.query)
//       .search()
//       .filter()
//       .pagination(resPerPage);

//     const products = await apiFeatures.query;

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       productsCount,
//       resPerPage,
//       products,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Get single product
// // @route   GET /api/v1/products/:id
// // @access  Public
// exports.getProduct = async (req, res, next) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return next(
//         new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
//       );
//     }

//     res.status(200).json({
//       success: true,
//       data: product,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Create new product
// // @route   POST /api/v1/products
// // @access  Private/Admin
// exports.createProduct = async (req, res, next) => {
//   try {
//     req.body.createdBy = req.user.id;

//     const product = await Product.create(req.body);

//     res.status(201).json({
//       success: true,
//       data: product,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Update product
// // @route   PUT /api/v1/products/:id
// // @access  Private/Admin
// exports.updateProduct = async (req, res, next) => {
//   try {
//     let product = await Product.findById(req.params.id);

//     if (!product) {
//       return next(
//         new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
//       );
//     }

//     product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       success: true,
//       data: product,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Delete product
// // @route   DELETE /api/v1/products/:id
// // @access  Private/Admin
// exports.deleteProduct = async (req, res, next) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return next(
//         new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
//       );
//     }

//     await product.remove();

//     res.status(200).json({
//       success: true,
//       data: {},
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Create new review
// // @route   POST /api/v1/products/:id/reviews
// // @access  Private
// exports.createProductReview = async (req, res, next) => {
//   try {
//     const { rating, comment } = req.body;

//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return next(
//         new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
//       );
//     }

//     // Check if user already reviewed the product
//     const alreadyReviewed = product.reviews.find(
//       (review) => review.user.toString() === req.user._id.toString()
//     );

//     if (alreadyReviewed) {
//       return next(new ErrorResponse('Product already reviewed', 400));
//     }

//     const review = {
//       user: req.user._id,
//       name: req.user.name,
//       rating: Number(rating),
//       comment,
//     };

//     product.reviews.push(review);
//     product.numOfReviews = product.reviews.length;

//     // Calculate average rating
//     product.ratings =
//       product.reviews.reduce((acc, item) => item.rating + acc, 0) /
//       product.reviews.length;

//     await product.save({ validateBeforeSave: false });

//     res.status(200).json({
//       success: true,
//       message: 'Review added',
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Get all reviews of a product
// // @route   GET /api/v1/products/:id/reviews
// // @access  Public
// exports.getProductReviews = async (req, res, next) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return next(
//         new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
//       );
//     }

//     res.status(200).json({
//       success: true,
//       reviews: product.reviews,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Delete review
// // @route   DELETE /api/v1/products/reviews
// // @access  Private
// exports.deleteReview = async (req, res, next) => {
//   try {
//     const product = await Product.findById(req.query.productId);

//     if (!product) {
//       return next(
//         new ErrorResponse(`Product not found with id of ${req.query.productId}`, 404)
//       );
//     }

//     const reviews = product.reviews.filter(
//       (review) => review._id.toString() !== req.query.id.toString()
//     );

//     const numOfReviews = reviews.length;

//     // Calculate average rating
//     const ratings =
//       numOfReviews === 0
//         ? 0
//         : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
//           numOfReviews;

//     await Product.findByIdAndUpdate(
//       req.query.productId,
//       {
//         reviews,
//         ratings,
//         numOfReviews,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Review deleted',
//     });
//   } catch (err) {
//     next(err);
//   }
// };












const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');


// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
// Completed
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i'
        }
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// get only for mens
const getMensProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i'
        }
      }
    : {};

  const count = await Product.countDocuments({ ...keyword, category: 'Mens' });
  const products = await Product.find({ ...keyword, category: 'Mens' })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
// Completed
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
// Completed
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
// Completed
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, images, brand, category, subCategory, countInStock, user } = req.body;

  // console.log({name, price, description, images, brand, category, countInStock, user});


  const product = new Product({
    name,
    price,
    createdBy:user,
    images,
    // : [
    //   {
    //     public_id: "temp", // if using Cloudinary, you can pass actual public_id
    //     url: image,        // this is the Cloudinary image URL
    //   },
    // ],

    brand,
    category,
    subCategory,
    countInStock,
    description
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});


// Generate upload signature
// router.get("/signature",
// Completed
const generateUploadSignature = asyncHandler(async (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_API_SECRET
  );
  res.json({ timestamp, signature, cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY });
});




// @desc    Update a product data without image
// @route   PUT /api/products/:id
// @access  Private/Admin
// Completed
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, brand, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;

    // if (image && image !== product.image) {
    //   const uploadResponse = await cloudinary.uploader.upload(image, {
    //     upload_preset: 'ecommerce'
    //   });
    //   product.image = uploadResponse.secure_url;
    // }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
// Completed
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: 'Anonymous',
      rating: Number(rating),
      comment,
      user: "689ff606db12335b27127163" ||req.user._id
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
// completed
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  generateUploadSignature,
  getMensProducts
};