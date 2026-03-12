const Post = require('../models/posts.model');

/**
 * Fetch all posts from the database and populate the author field.
 * @returns {Promise<Array>} Array of post documents
 */
const getAllPosts = async () => {
  return Post.find().populate('author', 'name email');
};

/**
 * Fetch a single post by its ID and populate the author field.
 * @param {string} id - Mongo ObjectId string for the post
 * @returns {Promise<Object|null>} Post document or null if not found
 */
const getPostById = async (id) => {
  return Post.findById(id).populate('author', 'name email');
};

/**
 * Create a new post document.
 * @param {Object} payload - object containing author, title, content
 * @returns {Promise<Object>} Created post document
 */
const createPost = async (payload) => {
  return Post.create(payload);
};

/**
 * Update an existing post by ID.
 * @param {string} id - Mongo ObjectId string for the post
 * @param {Object} updates - fields to update
 * @returns {Promise<Object|null>} Updated post document or null if not found
 */
const updatePost = async (id, updates) => {
  return Post.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};

/**
 * Delete a post by ID.
 * @param {string} id - Mongo ObjectId string for the post
 * @returns {Promise<Object|null>} Deleted post document (before deletion) or null
 */
const deletePost = async (id) => {
  return Post.findByIdAndDelete(id);
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
