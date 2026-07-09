const express = require('express');
const router = express.Router();
const {
  getCars,
  getCarDetails,
  createCar,
  updateCar,
  deleteCar,
  duplicateCar,
  bulkPublish,
  bulkDraft,
  bulkDelete
} = require('../controllers/car.controller');
const { protectAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getCars);
router.get('/:slug', getCarDetails);
router.get('/:brandSlug/:slug', getCarDetails); // supports both styles

// Admin protected routes
router.post('/bulk-publish', protectAdmin, bulkPublish);
router.post('/bulk-draft', protectAdmin, bulkDraft);
router.post('/bulk-delete', protectAdmin, bulkDelete);
router.post('/:id/duplicate', protectAdmin, duplicateCar);

router.post('/', protectAdmin, createCar);
router.put('/:id', protectAdmin, updateCar);
router.delete('/:id', protectAdmin, deleteCar);

module.exports = router;
