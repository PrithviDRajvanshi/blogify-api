const errorHandler = require('./error.middleware');
const requestLogger = require('./requestlogger');
const protect = require('./auth.middleware');

module.exports = {
  errorHandler,
  requestLogger,
  protect,
};