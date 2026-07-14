const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const fs = require('fs');

// Import routes
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const brandRoutes = require('./routes/brand.routes');
const carRoutes = require('./routes/car.routes');
const newsRoutes = require('./routes/news.routes');
const blogRoutes = require('./routes/blog.routes');
const enquiryRoutes = require('./routes/enquiry.routes');
const userRoutes = require('./routes/user.routes');
const uploadRoutes = require('./routes/upload.routes');
const adminRoutes = require('./routes/admin.routes');

// Initialize app
const app = express();

// Set security HTTP headers (disabled crossOriginResourcePolicy to allow frontend/admin image loading)
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

// Enable CORS with credential support (no wildcard origins allowed when credentials: true)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set static folders
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Fallback for API route not found (404)
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Format errors array if message is the only info
  const errors = process.env.NODE_ENV === 'development'
    ? [err.message, err.stack]
    : [err.message];

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An internal server error occurred',
    data: null,
    errors: errors
  });
});

module.exports = app;
