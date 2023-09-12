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
      min: 6,
      max: 20,
      require,
    },
    address: [
      {
        type: String,
      },
    ],
    phone: {
      type: Number,
      require,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
