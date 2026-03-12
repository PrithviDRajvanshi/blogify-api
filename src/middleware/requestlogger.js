const requestLogger = (req, res, next) => {
    console.log(`Request Received: ${req.method} ${req.originalUrl}`);
    next();
};
module.exports = requestLogger;