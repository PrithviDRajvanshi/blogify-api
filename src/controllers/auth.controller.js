const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

/**
 * Generate JWT token and set it in HttpOnly cookie
 */
const sendTokenResponse = (user, statusCode, res) => {
  // Create JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  // Set cookie options
  const cookieOptions = {
    httpOnly: true, // Cannot be accessed by client-side JS
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };

  // Set cookie
  res.cookie('token', token, cookieOptions);

  // Send response
  return res.status(statusCode).json({
    success: true,
    message: 'User logged in successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
};

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Validate input
    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if passwords match
    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email is already in use',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Send token response
    return sendTokenResponse(user, 201, res);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: err.message,
    });
  }
};

/**
 * Login user
 * POST /api/v1/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Send token response
    return sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error during login',
      error: err.message,
    });
  }
};

/**
 * Logout user
 * POST /api/v1/auth/logout
 */
const logout = (req, res) => {
  res.clearCookie('token');

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

module.exports = {
  register,
  login,
  logout,
};
