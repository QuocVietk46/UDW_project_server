const mongoose = require('mongoose');

const User = require('./userModel');
const Product = require('./productModel');

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: User,
  },
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: Product,
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
