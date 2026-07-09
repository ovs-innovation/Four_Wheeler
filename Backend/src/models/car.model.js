const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    modelName: {
      type: String,
      required: [true, 'Model name is required'],
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: String,
      default: 'car'
    },
    brand: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true
    },
    brandSlug: {
      type: String,
      lowercase: true,
      trim: true
    },
    brandId: {
      type: String,
      trim: true
    },
    modelId: {
      type: String,
      trim: true
    },
    variant: {
      type: String,
      trim: true
    },
    bodyType: {
      type: String,
      trim: true
    },
    fuelType: {
      type: String,
      trim: true
    },
    transmission: {
      type: String,
      trim: true
    },
    engineCC: {
      type: Number,
      default: 0
    },
    engineSize: {
      type: String,
      trim: true
    },
    mileage: {
      type: Number,
      default: 0
    },
    power: {
      type: Number,
      default: 0
    },
    torque: {
      type: Number,
      default: 0
    },
    topSpeed: {
      type: Number,
      default: 0
    },
    driveType: {
      type: String,
      trim: true
    },
    groundClearance: {
      type: Number,
      default: 0
    },
    bootSpace: {
      type: Number,
      default: 0
    },
    wheelbase: {
      type: Number,
      default: 0
    },
    fuelTank: {
      type: Number,
      default: 0
    },
    kerbWeight: {
      type: Number,
      default: 0
    },
    length: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    seatingCapacity: {
      type: Number,
      default: 5
    },
    airbags: {
      type: Number,
      default: 0
    },
    abs: {
      type: String,
      default: 'No'
    },
    adas: {
      type: String,
      default: 'No'
    },
    sunroof: {
      type: String,
      default: 'No'
    },
    touchscreen: {
      type: String,
      default: 'No'
    },
    infotainment: {
      type: String,
      default: ''
    },
    warranty: {
      type: String,
      default: ''
    },
    launchDate: {
      type: Date
    },
    price: {
      type: Number,
      required: true
    },
    onRoadPrice: {
      type: Number,
      default: 0
    },
    emi: {
      type: Number,
      default: 0
    },
    overview: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    features: {
      type: [String],
      default: []
    },
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    pros: {
      type: [String],
      default: []
    },
    cons: {
      type: [String],
      default: []
    },
    colors: [
      {
        name: { type: String },
        hex: { type: String }
      }
    ],
    colorOptions: {
      type: String,
      trim: true
    },
    availableVariants: [
      {
        name: { type: String },
        price: { type: Number }
      }
    ],
    isLatest: {
      type: Boolean,
      default: false
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    isUpcoming: {
      type: Boolean,
      default: false
    },
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'APPROVED', 'PENDING'],
      default: 'APPROVED'
    },
    seoTitle: {
      type: String,
      default: ''
    },
    seoDescription: {
      type: String,
      default: ''
    },
    seoKeywords: {
      type: String,
      default: ''
    },
    thumbnail: {
      type: String,
      default: ''
    },
    galleryImages: {
      type: [String],
      default: []
    },
    images: {
      type: String,
      default: ''
    },
    brochurePdf: {
      type: String,
      default: ''
    },
    videoUrl: {
      type: String,
      default: ''
    },
    safetyRating: {
      type: Number,
      default: 5
    },
    year: {
      type: Number,
      default: 2026
    },
    condition: {
      type: String,
      enum: ['NEW', 'USED', 'CERTIFIED_PRE_OWNED'],
      default: 'NEW'
    },
    sellerId: {
      type: String,
      default: 'dealer_apex'
    },
    sellerName: {
      type: String,
      default: 'Apex Motors India'
    },
    sellerPhone: {
      type: String,
      default: '+91 98888 88888'
    },
    sellerCity: {
      type: String,
      default: 'Mumbai'
    },
    sellerRole: {
      type: String,
      default: 'DEALER'
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Pre-save middleware to auto-generate slug, title, colorOptions, images, overview
carSchema.pre('save', function (next) {
  // Category must always be car
  this.category = 'car';

  // Slug generation
  if (!this.slug || this.isModified('modelName')) {
    let rawSlug = `${this.brand}-${this.modelName}-${this.variant || ''}`;
    this.slug = rawSlug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  // Auto generate title
  if (!this.title) {
    this.title = `${this.year} ${this.brand} ${this.modelName} ${this.variant || ''}`.trim();
  }

  // Set description to overview for frontend compatibility
  if (this.overview && !this.description) {
    this.description = this.overview;
  } else if (this.description && !this.overview) {
    this.overview = this.description;
  }

  // Sync colorOptions from colors array
  if (this.colors && this.colors.length > 0 && !this.colorOptions) {
    this.colorOptions = this.colors.map(c => c.name).join(',');
  }

  // Sync images comma separated string from galleryImages and thumbnail
  if (this.galleryImages && this.galleryImages.length > 0 && !this.images) {
    const allImages = [];
    if (this.thumbnail) allImages.push(this.thumbnail);
    allImages.push(...this.galleryImages);
    this.images = allImages.join(',');
  } else if (this.thumbnail && !this.images) {
    this.images = this.thumbnail;
  }

  next();
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
