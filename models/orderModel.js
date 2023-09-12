const mongoose = require('mongoose');
const User = require('./userModel');
const Staff = require('./staffModel');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: User,
    require,
  },
  staff: {
    type: mongoose.Types.ObjectId,
    ref: Staff,
    require,
  },
  date_order: {
    type: Date,
    require,
  },
  date_delivery: {
    type: Date,
    require,
  },
  status: {
    type: String,
    require,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
