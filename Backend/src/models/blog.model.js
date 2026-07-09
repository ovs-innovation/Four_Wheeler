const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: 'Riding Tips'
    },
    date: {
      type: String,
      required: true
    },
    readTime: {
      type: String,
      default: '5 min read'
    },
    author: {
      type: String,
      default: 'Author'
    },
    image: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
