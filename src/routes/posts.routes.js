const express = require("express");
const router = express.Router();

// import controller
const postController = require("../controllers/posts.controller");

// use controller instead of inline logic
router.get("/", postController.getAllPosts);
router.get("/:postId", postController.getPostById);

module.exports = router;
