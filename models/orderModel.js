const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    require,
  },
  price: {
    type: Number,
    require,
  },
  address: {
    type: String,
    require,
  },
  phone: {
    type: String,
    require,
  },
  full_name: {
    type: String,
    require,
  },
  staff: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    require,
  },
  detail: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'DetailOrder',
    },
  ],
  payment: {
    type: String,
    enum: ['VNPay', 'COD'],
    default: 'COD',
    require,
  },
  detail_payment: {
    type: mongoose.Types.ObjectId,
    ref: 'DetailPayment',
  },
  order_date: {
    type: Date,
    require,
  },
  delivery_date: {
    type: Date,
    require,
  },
  status: {
    type: String,
    enum: ['pending', 'shipping', 'delivered', 'cancel'],
    default: 'pending',
    require,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
