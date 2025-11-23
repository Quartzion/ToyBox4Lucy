require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOURI, {
  ssl: true,
})

  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = mongoose.connection;