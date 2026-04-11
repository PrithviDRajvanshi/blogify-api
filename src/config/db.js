const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB_NAME || process.env.MONGO_DB_NAME;

    await mongoose.connect(uri, {
      dbName,
      // Use these in case you want to pass options later:
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
