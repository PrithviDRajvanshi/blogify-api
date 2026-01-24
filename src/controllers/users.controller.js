const getSingleUser = (req, res) => {
  // Express puts all URL parameters into the `req.params` object.
  // The property name matches the parameter name from our route definition.
  const requestedUserId = req.params.userId;

  // Now we have the ID! We can use it to fetch the user from a database.
  // For now, let's just send it back to confirm we got it.
  res.status(200).json({
    message: `You requested data for User ID: ${requestedUserId}`
  });
};

module.exports = {
  getSingleUser,
};