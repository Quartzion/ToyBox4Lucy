require('dotenv').config();
const mongoose = require('mongoose');

const env = process.env.NODE_ENV;
const sslBool = env === 'production'

mongoose.connect(process.env.MONGOURI, {
  ssl: sslBool,
})

  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = mongoose.connection;