const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    require,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
  },
  path: {
    type: String,
    require,
  },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
