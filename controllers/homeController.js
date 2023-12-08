const Product = require('../models/productModel');

const homeController = {
  index: async (req, res) => {
    const productsSale50 = await Product.find({ sale: { $gte: 50 } })
      .limit(3)
      .populate('images');
    const productsSale30 = await Product.find({ sale: { $gte: 30 } })
      .limit(3)
      .populate('images');
    const productsSale10 = await Product.find({ sale: { $gte: 10 } })
      .limit(3)
      .populate('images');

    return res.status(200).json({
      message: 'Get home success',
      productsSale50,
      productsSale30,
      productsSale10,
    });
  },
};

module.exports = homeController;
