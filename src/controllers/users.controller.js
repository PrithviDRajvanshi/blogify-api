const userService = require('../services/users.service');

const getSingleUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: err.message,
    });
  }
};

module.exports = {
  getSingleUser,
};