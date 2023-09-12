const Product = require('../models/productModel');

const productController = {
  addProduct: async (req, res) => {
    try {
      const { name, price } = req.body;

      const newProduct = new Product({
        name,
        price,
      });

      const saveProduct = await newProduct.save();

      return res.status(200).json({
        message: 'Them product thanh cong',
        product: saveProduct,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = productController;
