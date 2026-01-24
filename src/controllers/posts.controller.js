const getAllPosts = (req, res) => {
  res.status(200).json({
    message: "Route handled by postController.getAllPosts"
  });
};

const getPostById = (req, res) => {
  const requestedPostId = req.params.postId;
  res.status(200).json({
    message: `You requested data for Post ID: ${requestedPostId}`
  });
};

module.exports = {
  getAllPosts,
  getPostById,
};
