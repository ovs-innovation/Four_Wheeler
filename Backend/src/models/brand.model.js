const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Brand slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    isElectricOnly: {
      type: Boolean,
      default: false
    },
    country: {
      type: String,
      trim: true,
      default: ''
    },
    origin: {
      type: String,
      trim: true,
      default: ''
    }, // mapped to country
    founded: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    logo: {
      type: String,
      default: ''
    },
    banner: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published'
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
    }
  },
  {
    timestamps: true
  }
);

brandSchema.pre('save', function(next) {
  if (this.country && !this.origin) {
    this.origin = this.country;
  } else if (this.origin && !this.country) {
    this.country = this.origin;
  }
  next();
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
