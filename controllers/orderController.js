const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const DetailOrder = require('../models/detailOrderModel');
const moment = require('moment');

const orderController = {
  addOrder: async (req, res) => {
    try {
      // productArr = [{productId: 'id', quantity: 1}]
      const { address, phone, full_name, payment } = req.body;
      const userId = req.user._id;

      if (!address || !phone || !full_name) {
        return res.status(400).json({
          message: 'Please fill all required fields',
        });
      }

      const cart = await Cart.findOne({ userId }).populate('products.product');
      if (!cart) {
        return res.status(400).json({
          message: 'Cart not found',
        });
      }

      let detail = [];
      let price = 0;
      for (let i = 0; i < cart.products.length; i++) {
        const product = await Product.findById(cart.products[i].product._id);
        // product is not found or quantity of product is not enough
        if (!product) {
          return res.status(400).json({
            message: 'Product not found',
          });
        }
        if (product.quantity < cart.products[i].quantity) {
          return res.status(400).json({
            message: 'Not enough product in stock',
          });
        }

        // update quantity of product in stock
        product.quantity -= cart.products[i].quantity;

        // change status of product to out of stock
        if (product.quantity === 0) {
          product.status = 'unavailable';
        }

        // update price of order
        price +=
          product.price * cart.products[i].quantity -
          (product.sale / 100) * product.price * cart.products[i].quantity;

        // create detail order and push to products array
        const detailOrder = await DetailOrder.create({
          product: cart.products[i].product._id,
          quantity: cart.products[i].quantity,
          price: product.price,
          sale: product.sale || 0,
        });
        await product.save();
        detail.push(detailOrder);
      }

      const order = await Order.create({
        user: userId,
        address,
        price,
        phone,
        detail,
        full_name,
        order_date: Date.now(),
        payment,
      });

      res.status(201).json({
        message: 'Order created successfully',
        newOrder: order,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  getOrders: async (req, res) => {
    try {
      let status = req.query.status || 'all';

      if (status === 'all')
        status = ['pending', 'shipping', 'delivered', 'cancel'];

      const orders = await Order.find({
        user: req.user._id,
      })
        .populate({
          path: 'detail',
          select: 'product quantity price sale',
          populate: {
            path: 'product',
            select: '_id title images',
            populate: {
              path: 'images',
              select: 'filename path',
            },
          },
        })
        .select('-user')
        .where('status')
        .in(status);

      res.status(200).json({
        message: 'Get orders successfully',
        orders: orders,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },

  getOrdersAdmin: async (req, res) => {
    try {
      let status = req.query.status || 'all';
      console.log({ status });

      if (status === 'all')
        status = ['pending', 'shipping', 'delivered', 'cancel'];

      const orders = await Order.find()
        .populate({
          path: 'detail',
          select: 'product quantity price sale',
          populate: {
            path: 'product',
            select: '_id title images',
            populate: {
              path: 'images',
              select: 'filename path',
            },
          },
        })
        .where('status')
        .in(status);

      res.status(200).json({
        message: 'Get orders successfully',
        orders: orders,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },

  updateOrder: async (req, res) => {
    try {
      console.log(req.body);
      const { status } = req.body;
      const orderId = req.params.id;
      const userId = req.user._id;

      if (!status) {
        return res.status(400).json({
          message: 'Nothing to update',
        });
      }
      console.log(req.user.role);
      if (
        req.user.role !== 'admin' &&
        (status === 'pending' || status === 'shipping')
      ) {
        return res.status(403).json({
          message: 'You are not allowed to do this',
        });
      }

      const order = await Order.findById(orderId).populate({
        path: 'detail',
        select: 'product quantity price sale',
        populate: {
          path: 'product',
          select: '_id title images',
          populate: {
            path: 'images',
            select: 'filename path',
          },
        },
      });
      if (!order) {
        return res.status(400).json({
          message: 'Order not found',
        });
      }

      if (
        userId.toString() !== order.user.toString() &&
        req.user.role !== 'admin'
      ) {
        console.log('here');
        return res.status(403).json({
          message: 'You are not allowed to do this',
        });
      }

      if (status === 'cancel') {
        // return product to stock
        for (let i = 0; i < order.detail.length; i++) {
          const product = await Product.findById(order.detail[i].product._id);
          product.quantity += order.detail[i].quantity;
          if (product.quantity > 0 && product.status === 'unavailable') {
            product.status = 'available';
          }
          await product.save();
        }
      }

      if (status === 'delivered') {
        order.delivery_date = Date.now();
      }

      order.status = status;
      order.staff = req.user._id;
      await order.save();

      res.status(200).json({
        message: 'Update order successfully',
        newOrder: order,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },

  addOrderByVNPay: (req, res) => {
    try {
      const { address, phone, full_name, payment } = req.body;
      var ipAddr =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      var tmnCode = '72INSZBT';
      var secretKey = 'IOWSLUVLKYTVKNXODGTWAVPSGCWJXJIS';
      var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
      var returnUrl =
        'http://localhost:3001/order/payment_vnpay_return?address=' +
        address +
        '&phone=' +
        phone +
        '&full_name=' +
        full_name +
        '&payment=' +
        payment;
      const date = new Date();
      var createDate = moment(date).format('YYYYMMDDHHmmss');
      var orderId = new Date().getTime();
      var amount = req.body.amount;
      var bankCode = req.body.bankcode;

      var orderInfo = 'Thanh toan don hang';
      var orderType = 'billpayment';
      var locale = 'vn';
      var currCode = 'VND';
      var vnp_Params = {};
      vnp_Params['vnp_Version'] = '2.1.0';
      vnp_Params['vnp_Command'] = 'pay';
      vnp_Params['vnp_TmnCode'] = tmnCode;
      vnp_Params['vnp_Locale'] = locale;
      vnp_Params['vnp_CurrCode'] = currCode;
      vnp_Params['vnp_TxnRef'] = orderId;
      vnp_Params['vnp_OrderInfo'] = orderInfo;
      vnp_Params['vnp_OrderType'] = orderType;
      vnp_Params['vnp_Amount'] = amount * 100;
      vnp_Params['vnp_ReturnUrl'] = returnUrl;
      vnp_Params['vnp_IpAddr'] = ipAddr;
      vnp_Params['vnp_CreateDate'] = createDate;
      if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
      }

      vnp_Params = sortObject(vnp_Params);

      var querystring = require('qs');
      var signData = querystring.stringify(vnp_Params, { encode: false });
      var crypto = require('crypto');
      var hmac = crypto.createHmac('sha512', secretKey);
      const signed = hmac
        .update(new Buffer.from(signData, 'utf-8'))
        .digest('hex');
      vnp_Params['vnp_SecureHash'] = signed;
      vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

      res.send({
        code: '00',
        vnpUrl,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  },
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

module.exports = orderController;
