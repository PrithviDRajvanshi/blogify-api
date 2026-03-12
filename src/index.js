require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Import middleware from central file
const { errorHandler, requestLogger } = require('./middleware');

// Import routes
const apiRouter = require('./routes');

const connectDB = require('./config/db'); // 1. Import the connection function

// Global middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/v1', apiRouter);

// Error handler LAST
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// 2. Call the connection function to establish a connection
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});