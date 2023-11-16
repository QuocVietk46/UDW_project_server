const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new Schema(
  {
    full_name: {
      type: String,
      min: 6,
      max: 50,
      require,
    },
    password: {
      type: String,
      min: 8,
      max: 20,
      require,
    },
    email: {
      type: String,
      min: 6,
      max: 50,
      require,
      unique: true,
    },
    address: [
      {
        type: String,
      },
    ],
    phone: String,
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      require,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
