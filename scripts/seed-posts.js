const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../src/models/users.model');
const Post = require('../src/models/posts.model');

async function main() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/blogify_test';
  await mongoose.connect(uri);

  // Ensure at least one user exists (required by Post.author)
  let user = await User.findOne();
  if (!user) {
    user = await User.create({ name: 'Seed User', email: 'seed@example.com' });
    console.log('Created seed user:', user._id.toString());
  }

  const samplePosts = [
    {
      author: user._id,
      title: 'Welcome to Blogify',
      content: 'This is your first post. Edit or delete it to get started!',
    },
    {
      author: user._id,
      title: 'Mock Data Example',
      content:
        'You can generate mock posts from Mockaroo and import them into your database.',
    },
    {
      author: user._id,
      title: 'Another Post',
      content:
        'Feel free to change this content or add more posts using the API.',
    },
  ];

  const created = await Post.insertMany(samplePosts);
  console.log('Created posts:', created.map((p) => p._id.toString()));

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
