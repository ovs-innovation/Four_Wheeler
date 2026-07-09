const Enquiry = require('../models/enquiry.model');

/**
 * @desc Get all enquiries (Admin sees all, User sees their own)
 * @route GET /api/enquiries
 * @access Private
 */
const getEnquiries = async (req, res, next) => {
  try {
    let query = {};

    // regular user gets only their enquiries
    if (req.user) {
      query = { user: req.user.id };
    } else if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Access denied: not authenticated',
        data: null,
        errors: ['Authentication required']
      });
    }

    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Enquiries retrieved successfully',
      data: enquiries,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create new enquiry (User or Guest)
 * @route POST /api/enquiries
 * @access Public
 */
const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, bikeName, bikeBrand, type, message } = req.body;

    let enquiryData = {
      bikeName,
      bikeBrand,
      type,
      message,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      status: 'Pending'
    };

    // If logged in, bind profile details automatically
    if (req.user) {
      enquiryData.user = req.user.id;
      enquiryData.name = req.user.name || name;
      enquiryData.email = req.user.email || email;
      enquiryData.phone = req.user.phone || phone;
    } else {
      // Guest checks
      if (!name || !email || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Enquiry submission failed',
          data: null,
          errors: ['Guest submissions require name, email and phone number']
        });
      }
      enquiryData.name = name;
      enquiryData.email = email;
      enquiryData.phone = phone;
    }

    console.log("========== CREATE ENQUIRY ==========");
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);
    console.log("enquiryData:", enquiryData);
    console.log("====================================");

    const enquiry = await Enquiry.create(enquiryData);

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been submitted successfully',
      data: enquiry,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update enquiry status
 * @route PUT /api/enquiries/:id
 * @access Private (Admin Only)
 */
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Approved', 'Contacted'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status update',
        data: null,
        errors: ['Status must be Pending, Approved, or Contacted']
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
        data: null,
        errors: ['Enquiry record not found']
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry status updated successfully',
      data: enquiry,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete or cancel enquiry
 * @route DELETE /api/enquiries/:id
 * @access Private (User or Admin)
 */
const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
        data: null,
        errors: ['Enquiry not found']
      });
    }

    // Ensure users can only delete their own enquiries, while admins can delete any
    if (req.user && enquiry.user && enquiry.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: cannot modify other users enquiries',
        data: null,
        errors: ['Forbidden']
      });
    }

    await Enquiry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Enquiry cancelled successfully',
      data: {},
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEnquiries,
  createEnquiry,
  updateEnquiryStatus,
  deleteEnquiry
};
