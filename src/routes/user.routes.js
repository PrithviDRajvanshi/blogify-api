const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller.js');

// Connect the route to the controller.
router.get('/:userId', userController.getSingleUser);

module.exports = router;