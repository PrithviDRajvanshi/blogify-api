const express = require('express');
const router = express.Router();

// Import resource-specific routers
const authRouter = require('./auth.routes.js');
const postRouter = require('./posts.routes.js');
const userRouter = require('./user.routes.js');

// Mount routers
router.use('/auth', authRouter);
router.use('/posts', postRouter);
router.use('/users', userRouter);

module.exports = router;
