const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const cartController = {
  addProductToCart: async (req, res) => {
    try {
      console.log(req.body);
      const { productId, quantity } = req.body;
      if (quantity > 10 || quantity < 1) {
        return res.status(400).json({
          error: 'Số lượng phải trong khoản 1 - 10',
        });
      }

      const userId = req.user._id;

      const product = await Product.findById(productId);
      if (product.quantity < quantity) {
        return res.status(400).json({
          error: 'Not enough product in stock',
        });
      }

      const cart = await Cart.findOne({ userId }).populate({
        path: 'products.product',
        select: ['title', 'price', '_id', 'images'],
        populate: {
          path: 'images',
          select: ['path', 'filename'],
        },
      });

      if (!cart) {
        const newCart = await Cart.create({
          userId: userId,
          products: [{ product: productId, quantity: quantity }],
        });

        return res.status(200).json({
          message: 'Add product to cart successfully',
          cart: newCart,
        });
      }

      const index = cart.products.findIndex(
        (item) => item.product._id.toString() === productId
      );

      // If product already in cart, increase quantity
      if (index !== -1) {
        if (cart.products[index].quantity + quantity > 10) {
          return res.status(400).json({
            error: 'Số lượng bạn đặt quá giới hạn 10 sản phẩm',
          });
        }
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
        newCart: cart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const cart = await Cart.findOne({ userId: req.user._id }).populate({
        path: 'products.product',
        select: ['title', 'price', '_id', 'images'],
        populate: {
          path: 'images',
          select: ['path', 'filename'],
        },
      });

      const index = cart.products.findIndex(
        (item) => item.product._id.toString() === productId
      );

      if (index === -1) {
        return res.status(400).json({
          error: 'Product not found in cart',
        });
      }

      cart.products[index].quantity = quantity;

      await cart.save();

      return res.status(200).json({
        message: 'Update cart successfully',
        newCart: cart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  removeProductInCart: async (req, res) => {
    try {
      const { id } = req.params;
      const cart = await Cart.findOne({ userId: req.user._id });
      const index = cart.products.findIndex(
        (item) => item.product.toString() === id
      );

      if (index === -1) {
        return res.status(400).json({
          error: 'Product not found in cart',
        });
      }

      cart.products.splice(index, 1);
      await cart.save();

      return res.status(200).json({
        message: 'Remove product successfully',
        newCart: cart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  clearCart: async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.user._id });
      cart.products = [];
      await cart.save();

      return res.status(200).json({
        message: 'Clear cart successfully',
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getCart: async (req, res) => {
    try {
      const userId = req.user._id;
      const cart = await Cart.findOne({ userId }).populate({
        path: 'products.product',
        select: ['title', 'price', '_id', 'images'],
        populate: {
          path: 'images',
          select: ['path', 'filename'],
        },
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
