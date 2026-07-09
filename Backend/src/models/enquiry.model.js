const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    city: {
      type: String,
      trim: true,
      default: ''
    },
    vehicleId: {
      type: String,
      trim: true,
      default: ''
    },
    vehicleTitle: {
      type: String,
      trim: true,
      default: ''
    },
    bikeName: {
      type: String,
      trim: true
    }, // Alias for compatibility with copied controllers
    bikeBrand: {
      type: String,
      trim: true
    }, // Alias for compatibility
    type: {
      type: String,
      required: true,
      trim: true
    }, // TEST_DRIVE, GET_OFFER, request callback, EMI, etc.
    message: {
      type: String,
      trim: true,
      default: ''
    },
    date: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Contacted', 'Cancelled', 'Closed'],
      default: 'Pending'
    },
    assignedExecutive: {
      type: String,
      trim: true,
      default: ''
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

enquirySchema.pre('save', function (next) {
  if (this.vehicleTitle && !this.bikeName) {
    this.bikeName = this.vehicleTitle;
  } else if (this.bikeName && !this.vehicleTitle) {
    this.vehicleTitle = this.bikeName;
  }
  next();
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry;
