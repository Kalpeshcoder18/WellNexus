// src/config/db.js
const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wellnexus';
  if (!uri) {
    throw new Error('MONGODB_URI not set in environment (.env)');
  }

  try {
    // Use recommended options for mongoose 6+
    await mongoose.connect(uri, {
      // dbName: process.env.MONGODB_DBNAME || undefined, // uncomment if you want explicit dbName
      // useNewUrlParser and useUnifiedTopology no longer required since modern versions set them by default
      autoIndex: true
    });
    console.log('MongoDB connected ->', uri.includes('localhost') ? 'local' : 'atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};
