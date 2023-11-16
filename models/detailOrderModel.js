const mongoose = require('mongoose');

const detailOrderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    require,
  },
  quantity: {
    type: Number,
    require,
  },
  sale: {
    type: Number,
  },
  price: {
    type: Number,
    require,
  },
});

const DetailOrder = mongoose.model('DetailOrder', detailOrderSchema);

module.exports = DetailOrder;
