const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../src/models/users.model');

const main = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/blogify_test';
    await mongoose.connect(uri);
    const u = await User.create({ name: 'Seed User', email: 'seed@example.com' });
    console.log('created user', u);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
};

main();
