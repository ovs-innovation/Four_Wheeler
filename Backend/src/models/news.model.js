const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
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
      default: 'Industry'
    },
    date: {
      type: String,
      required: true
    },
    readTime: {
      type: String,
      default: '3 min read'
    },
    author: {
      type: String,
      default: 'Editor'
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

const News = mongoose.model('News', newsSchema);

module.exports = News;
