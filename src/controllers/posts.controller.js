const getAllPosts = (req, res) => {
  // In the future this should fetch from a DB/service.
  const posts = [];

  return res.status(200).json({
    success: true,
    data: { posts },
  });
};

const getPostById = (req, res) => {
  const requestedPostId = req.params.postId;

  // In the future this should fetch a real post by ID.
  const post = { id: requestedPostId };

  return res.status(200).json({
    success: true,
    data: { post },
  });
};

module.exports = {
  getAllPosts,
  getPostById,
};
