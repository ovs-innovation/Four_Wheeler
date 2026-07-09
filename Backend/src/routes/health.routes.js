const express = require('express');
const router = express.Router();
const { getHealthStatus } = require('../controllers/health.controller');

// @route   GET /api/v1/health
router.get('/', getHealthStatus);

module.exports = router;
