const express = require('express');
const router = express.Router();
const {
  getNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews
} = require('../controllers/news.controller');
const { protectAdmin } = require('../middleware/auth.middleware');

router.get('/', getNews);
router.get('/:slug', getNewsBySlug);

router.post('/', protectAdmin, createNews);
router.put('/:id', protectAdmin, updateNews);
router.delete('/:id', protectAdmin, deleteNews);

module.exports = router;
