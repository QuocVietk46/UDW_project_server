const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const cartController = {
  addProductToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user._id;

      const product = await Product.findById(productId);
      if (product.quantity < quantity) {
        return res.status(400).json({
          error: 'Not enough product in stock',
        });
      }

      const cart = await Cart.findOne({ userId });

      const index = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (index !== -1) {
        cart.products[index].quantity += quantity;
        await cart.save();

        return res.status(200).json({
          message: 'Add product to cart successfully',
          cart: cart,
        });
      }

      cart.products = [
        ...cart.products,
        { product: productId, quantity: quantity },
      ];
      await cart.save();

      return res.status(200).json({
        message: 'Add product to cart successfully',
        cart: cart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateCart: async (req, res) => {
    try {
      //products: [{productId: 'id', quantity: 1}]
      const { products } = req.body;
      const cart = await Cart.findOne({ userId: req.user._id });

      for (let i = 0; i < products.length; i++) {
        const product = await Product.findById(products[i].productId);
        if (product.quantity < products[i].quantity) {
          return res.status(400).json({
            error: 'Not enough product in stock',
          });
        }

        const index = cart.products.findIndex(
          (item) => item.productId.toString() === products[i].productId
        );

        if (index === -1) {
          return res.status(400).json({
            error: 'Product not found in cart',
          });
        }

        if (products[i].quantity === 0) {
          cart.products.splice(index, 1);
          await cart.save();
          continue;
        }

        cart.products[index].quantity = products[i].quantity;
        await cart.save();
      }

      return res.status(200).json({
        message: 'Update cart successfully',
        cart: cart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getCart: async (req, res) => {
    try {
      const userId = req.user._id;
      const cart = await Cart.findOne({ userId }).populate({
        path: 'products',
        select: ['name', 'price', '_id', 'images', 'quantity'],
      });
      return res.status(200).json({
        cart: cart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = cartController;
