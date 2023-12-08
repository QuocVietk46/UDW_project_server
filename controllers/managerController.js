const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Rate = require('../models/rateModel');
const Comment = require('../models/commentModel');

const managerController = {
  dashBoard: async (req, res) => {
    try {
      // get profit of month
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const orders = await Order.find({
        order_date: { $gte: firstDay, $lte: lastDay },
        status: 'delivered',
      });

      let profitMonth = 0;
      orders.forEach((order) => {
        profitMonth += order.price;
      });

      // get count orders of month
      const countOrdersOfMonth = await Order.countDocuments({
        order_date: { $gte: firstDay, $lte: lastDay },
      });

      // get count orders
      const countOrders = await Order.countDocuments();
      const countPending = await Order.countDocuments({ status: 'pending' });
      const countShipping = await Order.countDocuments({ status: 'shipping' });
      const countDelivered = await Order.countDocuments({
        status: 'delivered',
      });
      const countCancel = await Order.countDocuments({ status: 'cancel' });

      const countUser = await User.countDocuments({ role: 'user' });

      // get count products
      const countProduct = await Product.countDocuments();

      // get count rating
      const countRating = await Rate.countDocuments();

      // get count comment
      const countComment = await Comment.countDocuments();

      return res.status(200).json({
        message: 'Admin dashboard',
        order: {
          countOrders,
          countPending,
          countShipping,
          countDelivered,
          countCancel,
        },
        product: {
          countProduct,
          countRating,
          countComment,
        },
        profitMonth,
        countOrdersOfMonth,
        countUser,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const users = await User.find({ role: 'user' });

      // create promise all to count order of users
      const promises = users.map(async (user) => {
        const countOrder = await Order.countDocuments({ user: user._id });
        const countOrderCancel = await Order.countDocuments({
          user: user._id,
          status: 'cancel',
        });
        const countOrderDelivered = await Order.countDocuments({
          user: user._id,
          status: 'delivered',
        });
        const countOrderShipping = await Order.countDocuments({
          user: user._id,
          status: 'shipping',
        });
        const countOrderPending = await Order.countDocuments({
          user: user._id,
          status: 'pending',
        });

        return {
          ...user._doc,
          countOrder,
          countOrderCancel,
          countOrderDelivered,
          countOrderShipping,
          countOrderPending,
        };
      });

      const usersWithCountOrder = await Promise.all(promises);

      return res
        .status(200)
        .json({ message: 'Get all users', users: usersWithCountOrder });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getProfit: async (req, res) => {
    try {
      const { month, year } = req.query;
      console.log(month, year);
      // count quantity product sell
      let products = [];

      console.log(new Date(year, month - 1, 1));

      const orders = await Order.find({
        order_date: {
          $gte: new Date(year, month - 1, 1),
          $lte: new Date(year, month, 0),
        },
        status: 'delivered',
      }).populate({
        path: 'detail',
        populate: {
          path: 'product',
        },
      });

      orders.forEach((order) => {
        order.detail.forEach((detail) => {
          const index = products.findIndex(
            (item) =>
              item.product._id === detail.product._id &&
              item.sale === detail.sale
          );

          if (index === -1) {
            products.push({
              product: detail.product,
              quantity: detail.quantity,
              sale: detail.sale,
            });
          } else {
            products[index].quantity += detail.quantity;
          }
        });
      });

      return res
        .status(200)
        .json({ message: 'Get profit of product', products });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = managerController;
