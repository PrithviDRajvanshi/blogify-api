const express = require("express");
const router = express.Router();

// import controller
const postController = require("../controllers/posts.controller");
// import auth middleware
const { protect } = require("../middleware");

// Public routes
router.get("/", postController.getAllPosts);
router.get("/:postId", postController.getPostById);

// Protected routes (require authentication)
router.post("/", protect, postController.createPost);
router.patch("/:postId", protect, postController.updatePost);
router.delete("/:postId", protect, postController.deletePost);

module.exports = router;
