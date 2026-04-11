const mongoose = require('mongoose');
const User = require('../src/models/users.model');
const Post = require('../src/models/posts.model');
require('dotenv').config();

async function main() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/blogify_test';
  await mongoose.connect(uri);
  const users = await User.find();
  const posts = await Post.find();
  const pop = await Post.find().populate('author','name email');
  console.log('users:', users);
  console.log('posts:', posts);
  console.log('populated result:', pop);
  await mongoose.disconnect();
}

main().catch(console.error);
