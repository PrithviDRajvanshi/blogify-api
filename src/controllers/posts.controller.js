const postService = require('../services/posts.service');

// GET /api/v1/posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    return res.status(200).json({
      success: true,
      data: { posts },
    });
  } catch (err) {
    // forward to error handler middleware
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch posts',
      error: err.message,
    });
  }
};

// GET /api/v1/posts/:postId
const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: { post },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: err.message,
    });
  }
};

// POST /api/v1/posts (Protected - Requires Authentication)
const createPost = async (req, res) => {
  try {
    const payload = req.body;
    // Attach the current user as the author
    payload.author = req.user.id;

    const newPost = await postService.createPost(payload);
    return res.status(201).json({
      success: true,
      data: { post: newPost },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create post',
      error: err.message,
    });
  }
};

// PATCH /api/v1/posts/:postId (Protected - Requires Authentication & Ownership)
const updatePost = async (req, res) => {
  const { postId } = req.params;
  const updates = req.body;

  try {
    // First, get the post to check ownership
    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user is the author (Authorization check)
    if (post.author._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this post',
      });
    }

    // Update the post
    const updated = await postService.updatePost(postId, updates);

    return res.status(200).json({
      success: true,
      data: { post: updated },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update post',
      error: err.message,
    });
  }
};

// DELETE /api/v1/posts/:postId (Protected - Requires Authentication & Ownership)
const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    // First, get the post to check ownership
    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user is the author (Authorization check)
    if (post.author._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post',
      });
    }

    // Delete the post
    const deleted = await postService.deletePost(postId);

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      error: err.message,
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};


