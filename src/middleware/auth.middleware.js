const jwt = require('jsonwebtoken');

/**
 * Protect middleware to authenticate requests
 * Reads JWT from HttpOnly cookie and verifies it
 * Attaches user info to req.user if valid
 */
const protect = (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource',
      error: err.message,
    });
  }
};

module.exports = protect;
