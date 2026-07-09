const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUserStatus,
  deleteUser
} = require('../controllers/user.controller');
const { protectAdmin } = require('../middleware/auth.middleware');

router.use(protectAdmin); // Protect all routes in this file for admins

router.get('/', getUsers);
router.put('/:id/status', updateUserStatus);
router.delete('/:id', deleteUser);

module.exports = router;
