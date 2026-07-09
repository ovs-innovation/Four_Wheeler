const Blog = require('../models/blog.model');

/**
 * @desc Get all blog posts
 * @route GET /api/blogs
 * @access Public
 */
const getBlogs = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: 'Blogs retrieved successfully',
      data: {
        blogs,
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
 * @desc Get blog by slug
 * @route GET /api/blogs/:slug
 * @access Public
 */
const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
        data: null,
        errors: ['Blog post not found']
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post retrieved successfully',
      data: blog,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create blog post
 * @route POST /api/blogs
 * @access Private (Admin)
 */
const createBlog = async (req, res, next) => {
  try {
    const blogData = req.body;

    const lastBlog = await Blog.findOne().sort({ id: -1 });
    const nextId = lastBlog && lastBlog.id ? lastBlog.id + 1 : 1;
    blogData.id = nextId;

    const existingSlug = await Blog.findOne({ slug: blogData.slug });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'Blog post creation failed',
        data: null,
        errors: ['Slug is already taken by another post']
      });
    }

    // Set default date if missing
    if (!blogData.date) {
      blogData.date = new Date().toISOString().split('T')[0];
    }

    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: blog,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update blog post
 * @route PUT /api/blogs/:id
 * @access Private (Admin)
 */
const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
        data: null,
        errors: ['Blog post not found']
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: blog,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete blog post
 * @route DELETE /api/blogs/:id
 * @access Private (Admin)
 */
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
        data: null,
        errors: ['Blog post not found']
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
      data: {},
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
};
