const News = require('../models/news.model');

/**
 * @desc Get all news articles
 * @route GET /api/news
 * @access Public
 */
const getNews = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: 'News articles retrieved successfully',
      data: {
        news,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      },
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get news by slug
 * @route GET /api/news/:slug
 * @access Public
 */
const getNewsBySlug = async (req, res, next) => {
  try {
    const newsItem = await News.findOne({ slug: req.params.slug });
    if (!newsItem) {
      return res.status(404).json({
        success: false,
        message: 'News article not found',
        data: null,
        errors: ['News article not found']
      });
    }

    res.status(200).json({
      success: true,
      message: 'News article retrieved successfully',
      data: newsItem,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create news article
 * @route POST /api/news
 * @access Private (Admin)
 */
const createNews = async (req, res, next) => {
  try {
    const newsData = req.body;

    const lastNews = await News.findOne().sort({ id: -1 });
    const nextId = lastNews && lastNews.id ? lastNews.id + 1 : 1;
    newsData.id = nextId;

    const existingSlug = await News.findOne({ slug: newsData.slug });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'News article creation failed',
        data: null,
        errors: ['Slug is already taken by another article']
      });
    }

    // Set default date if missing
    if (!newsData.date) {
      newsData.date = new Date().toISOString().split('T')[0];
    }

    const news = await News.create(newsData);

    res.status(201).json({
      success: true,
      message: 'News article created successfully',
      data: news,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update news article
 * @route PUT /api/news/:id
 * @access Private (Admin)
 */
const updateNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found',
        data: null,
        errors: ['News article not found']
      });
    }

    res.status(200).json({
      success: true,
      message: 'News article updated successfully',
      data: news,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete news article
 * @route DELETE /api/news/:id
 * @access Private (Admin)
 */
const deleteNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found',
        data: null,
        errors: ['News article not found']
      });
    }

    res.status(200).json({
      success: true,
      message: 'News article deleted successfully',
      data: {},
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews
};
