const mongoose = require('mongoose');

const rateSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
  },
  value: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
  },
});

const Rate = mongoose.model('Rate', rateSchema);

module.exports = Rate;
