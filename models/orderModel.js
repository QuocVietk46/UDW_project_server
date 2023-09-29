const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    require,
  },
  staffId: {
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
    require,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
