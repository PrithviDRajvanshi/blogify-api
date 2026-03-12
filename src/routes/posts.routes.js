const express = require("express");
const router = express.Router();

// import controller
const postController = require("../controllers/posts.controller");

// CRUD endpoints
router.get("/", postController.getAllPosts);
router.get("/:postId", postController.getPostById);
router.post("/", postController.createPost);
router.patch("/:postId", postController.updatePost);
router.delete("/:postId", postController.deletePost);

module.exports = router;
