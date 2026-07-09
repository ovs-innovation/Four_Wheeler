const multer = require('multer');
const path = require('path');

// Configure disk storage details
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase()
    );
  }
});

// Enforce image and PDF mime types only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|pdf/;
  const isExtensionValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isMimeValid = allowedTypes.test(file.mimetype) || file.mimetype === 'application/pdf';

  if (isExtensionValid && isMimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Access denied: upload must be a valid image (jpeg, jpg, png, webp, gif) or PDF document'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
