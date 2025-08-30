// const express = require('express');
// const dotenv = require('dotenv');
// const morgan = require('morgan');
// const colors = require('colors');
// const cookieParser = require('cookie-parser');
// const mongoSanitize = require('express-mongo-sanitize');
// const helmet = require('helmet');
// const xss = require('xss-clean');
// const rateLimit = require('express-rate-limit');
// const hpp = require('hpp');
// const cors = require('cors');
// const errorHandler = require('./middleware/errorHandler');
// const connectDB = require('./config/db');

// // Load env vars
// // dotenv.config({ path: './config/config.env' });
// // dotenv.config({ path: './config/config.env' })

// // Connect to database
// // connectDB();

// // Route files
// // const authRoutes = require('./routes/authRoutes');
// // const productRoutes = require('./routes/productRoutes');
// // const orderRoutes = require('./routes/orderRoutes');
// // const userRoutes = require('./routes/userRoutes');
// // const paymentRoutes = require('./routes/paymentRoutes');

// const app = express();

// // Body parser
// app.use(express.json());

// // Cookie parser
// app.use(cookieParser());

// // Dev logging middleware
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// // Sanitize data
// // app.use(mongoSanitize());

// // Set security headers
// // app.use(helmet());

// // Prevent XSS attacks
// // app.use(xss());

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 mins
//   max: 100,
// });
// app.use(limiter);

// // Prevent http param pollution
// // app.use(hpp());

// // Enable CORS
// app.use(cors());

// // Mount routers
// // app.use('/api/v1/auth', authRoutes);
// // app.use('/api/v1/products', productRoutes);
// // app.use('/api/v1/orders', orderRoutes);
// // app.use('/api/v1/users', userRoutes);
// // app.use('/api/v1/payment', paymentRoutes);

// // Error handler middleware
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// const server = app.listen(
//   PORT,
//   console.log(
//     `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
//   )
// );

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//   console.log(`Error: ${err.message}`.red);
//   // Close server & exit process
//   server.close(() => process.exit(1));
// });











const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorMiddleware');
// env variables
const dotenv = require('dotenv')
dotenv.config()

// Route files
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cartRoutes = require('./routes/cartRoutes');
// const { log } = require('console');
// Connect to database
connectDB();
const app = express();
// Body parser
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}
// Enable CORS
app.use(cors());


// Mount routers
// Completed
app.use('/api/users', authRoutes);

// product routes
// Completed
app.use('/api/products', productRoutes);

// order routes
app.use('/api/orders', orderRoutes);

// payment routes
app.use('/api/payments', paymentRoutes);

// cart routes
// Completed
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;


// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
