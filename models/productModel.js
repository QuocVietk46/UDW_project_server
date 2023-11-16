const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require,
    },
    price: {
      type: Number,
      require,
    },
    sale: {
      type: Number,
      default: 0,
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
      enum: ['t-shirt', 'shirts', 'jeans', 'short', 'pant', 'jacket'],
      require,
    },
    status: {
      type: String,
      enum: ['draft', 'available', 'unavailable', 'stop'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
