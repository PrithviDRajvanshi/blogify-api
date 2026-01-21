const express = require('express');
const router = express.Router();

// Route to get all blog posts
router.get('/', (req, res) => {
  res.send('Fetching all blog posts...');
});

module.exports = router;