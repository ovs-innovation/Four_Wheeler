const express = require('express');
const router = express.Router();
const {
  getEnquiries,
  createEnquiry,
  updateEnquiryStatus,
  deleteEnquiry
} = require('../controllers/enquiry.controller');
const {
  protectAdmin,
  optionalProtectUser,
  protectUserOrAdmin
} = require('../middleware/auth.middleware');

router.post('/', optionalProtectUser, createEnquiry);
router.get('/', protectUserOrAdmin, getEnquiries);
router.delete('/:id', protectUserOrAdmin, deleteEnquiry);

router.put('/:id', protectAdmin, updateEnquiryStatus);
router.patch('/:id', protectAdmin, updateEnquiryStatus);

module.exports = router;
