const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const DetailOrder = require('../models/detailOrderModel');

const orderController = {
  addOrder: async (req, res) => {
    try {
      // productArr = [{productId: 'id', quantity: 1}]
      const { cartId, address, phone, productArr } = req.body;
      const userId = req.user._id;

      if (!cartId || !address || !phone || !productArr) {
        return res.status(400).json({
          error: 'Please fill all required fields',
        });
      }

      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(400).json({
          error: 'Cart not found',
        });
      }

      let detail = [];
      for (let i = 0; i < productArr.length; i++) {
        const product = await Product.findById(productArr[i].productId);
        // product is not found or quantity of product is not enough
        if (!product) {
          return res.status(400).json({
            error: 'Product not found',
          });
        }
        if (product.quantity < productArr[i].quantity) {
          return res.status(400).json({
            error: 'Not enough product in stock',
          });
        }

        // update quantity of product in stock
        product.quantity -= productArr[i].quantity;
        await product.save();

        // update quantity of product in cart
        const index = cart.products.findIndex(
          (item) => item.productId === productArr[i].productId
        );
        if (index !== -1) {
          cart.products.splice(index, 1);
        }
        await cart.save();

        // create detail order and push to products array
        const detailOrder = await DetailOrder.create({
          productId: productArr[i].productId,
          quantity: productArr[i].quantity,
          price: product.price,
          sale: product.sale || 0,
        });
        console.log(detailOrder);
        detail.push(detailOrder._id);
      }

      const order = await Order.create({
        userId,
        address,
        phone,
        detail,
      });

      res.status(201).json({
        message: 'Order created successfully',
        data: { order, detail },
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },

  getOrders: async (req, res) => {
    try {
      const status = req.query.status || ['pending', 'shipping'];
      const orders = await Order.find({
        userId: req.user._id,
      })
        .populate('detail')
        .where('status')
        .in(status);

      res.status(200).json({
        message: 'Get orders successfully',
        orders: orders,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },

  getOrdersAdmin: async (req, res) => {
    try {
      const { status } = req.query;

      const orders = await Order.find({ status }).populate('detail');

      res.status(200).json({
        message: 'Get orders successfully',
        orders: orders,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },

  updateOrder: async (req, res) => {
    try {
      const { orderId, status } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(400).json({
          error: 'Order not found',
        });
      }

      order.status = status;
      order.staffId = req.user._id;
      await order.save();

      res.status(200).json({
        message: 'Update order successfully',
        order: order,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const { orderId } = req.body;

      const order = await Order.find({ _id: orderId, userId: req.user._id });
      if (!order) {
        return res.status(400).json({
          error: 'Order not found',
        });
      }

      if (order.status !== 'pending') {
        return res.status(400).json({
          error: 'Cannot delete this order',
        });
      }

      res.status(200).json({
        message: 'Delete order successfully',
        order: order,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },
};

module.exports = orderController;
