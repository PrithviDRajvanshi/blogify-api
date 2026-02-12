require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Import middleware from central file
const { errorHandler, requestLogger } = require('./middleware');

// Import routes
const apiRouter = require('./routes');

// Global middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/v1', apiRouter);

// Error handler LAST
app.use(errorHandler);

module.exports = app;
