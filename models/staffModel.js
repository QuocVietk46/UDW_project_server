const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const staffSchema = new Schema(
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
    role: {
      type: String,
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

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
