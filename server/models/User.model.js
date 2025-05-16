const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  name: String,
});

module.exports = model('User', userSchema);
