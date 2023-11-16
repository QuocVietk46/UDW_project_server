const Rate = require('../models/rateModel');
const Product = require('../models/productModel');

const rateController = {
  addRate: async (req, res, next) => {
    try {
      const { productId, rate } = req.body;
      const userId = req.user._id;

      if (!productId || !rate) {
        return res.status(400).json({
          message: 'Please fill all required fields',
        });
      }

      const newRate = new Rate({
        productId,
        userId,
        value: rate,
      });

      await newRate.save();

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({
          message: 'Product not found',
        });
      }

      const rates = await Rate.find({ productId });

      // calculate average rate
      product.rate = averageRate(rates);

      await product.save();

      return res.status(200).json({
        message: 'Add rate successfully',
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateRate: async (req, res) => {
    try {
      const { productId, rate } = req.body;
      const userId = req.user._id;

      const rateProduct = await Rate.findOne({ productId, userId });
      if (!rateProduct) {
        return res.status(400).json({
          message: 'You have not rated this product yet',
        });
      }

      rateProduct.value = rate;
      await rateProduct.save();

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({
          message: 'Product not found',
        });
      }

      const rates = await Rate.find({ productId });
      // calculate average rate
      product.rate = averageRate(rates);

      await product.save();

      return res.status(200).json({
        message: 'Update rate successfully',
        rate: rateProduct,
        product: product,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteRate: async (req, res) => {
    try {
      const { rateId } = req.body;
      const userId = req.user._id;

      const rateProduct = await Rate.findById(rateId);

      // if rate not found
      if (!rateProduct) {
        return res.status(400).json({
          message: 'Rate not found',
        });
      }

      // if user is not owner of this rate
      if (rateProduct.userId.toString() !== userId.toString()) {
        return res.status(400).json({
          message: 'You are not allowed to delete this rate',
        });
      }

      await rateProduct.remove();

      return res.status(200).json({
        message: 'Delete rate successfully',
        // product: productId,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getRate: async (req, res) => {
    try {
      const { productId } = req.params;

      const rates = await Rate.find({ productId })
        .populate({
          path: 'userId',
          select: 'full_name',
        })
        .sort({ createdAt: 1 });

      return res.status(200).json({
        message: 'Get rates successfully',
        rates: rates,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

// calculate average rate
const averageRate = (rates) => {
  let total = 0;
  rates.forEach((rate) => {
    total += rate.value;
  });
  return total / rates.length;
};

module.exports = rateController;
