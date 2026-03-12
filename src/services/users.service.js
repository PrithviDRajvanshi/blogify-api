const User = require('../models/users.model');

/**
 * Fetch a user by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

module.exports = {
  getUserById,
};
