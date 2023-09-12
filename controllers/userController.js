const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const User = {
  addProductToCart: async (req, res) => {
    try {
      const { product, user } = req.body;
      //Hien tai user la user_id

      const newCart = await Cart.findOneAndUpdate(
        {
          user,
        },
        {
          $push: {
            products: product,
          },
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        message: 'Them san pham vao cart thanh cong',
        cart: newCart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  removeProductFromCart: async (req, res) => {
    try {
      const { product, user } = req.body;
      //Hien tai user la user_id

      const newCart = await Cart.findOneAndUpdate(
        {
          user,
        },
        {
          $pull: {
            products: product,
          },
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        message: 'Xoa san pham tu cart thanh cong',
        cart: newCart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getAllProduct: async (req, res) => {
    try {
      const products = await Product.find();
      return res.status(200).json({
        products: products,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getCart: async (req, res) => {
    try {
      const { user } = req.body;
      //Hien tai user la user_id
      const cart = await Cart.findOne({ user }).populate({
        path: 'products',
        select: ['name', 'price', '_id'],
      });
      return res.status(200).json({
        cart: cart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = User;
