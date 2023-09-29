const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  title: {
    type: String,
    require,
  },
  price: {
    type: String,
    require,
  },
  sale: {
    type: Number,
  },
  quantity: {
    type: Number,
    require,
  },
  describe: {
    type: String,
  },
  images: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Image',
      require,
    },
  ],
  rate: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    enum: ['t-shirt', 'jeans', 'short', 'pant', 'jacket'],
    require,
  },
  status: {
    type: String,
    enum: ['available', 'unavailable', 'stop'],
    default: 'available',
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
