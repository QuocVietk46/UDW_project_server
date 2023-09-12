const User = require('../models/userModel');
const Cart = require('../models/cartModel');

const authController = {
  register: async (req, res) => {
    try {
      const { full_name, password, phone } = req.body;

      if (full_name.length === 0) {
        return res.status(400).json({
          message: 'Chua nhap ten',
        });
      }

      if (password.length < 6 || password.length > 20) {
        return res.status(400).json({
          message: 'Sai dinh dang mat khau',
        });
      }
      const user = await User.findOne({
        phone,
      });

      if (user) {
        return res.status(400).json({
          message: 'SDT da duoc su dung',
        });
      }

      const newUser = new User({
        full_name,
        password,
        phone,
      });

      const saveUser = await newUser.save();

      const cartUser = await User.findOne({ phone });

      const newCart = new Cart({
        user: cartUser._id,
      });

      await newCart.save();

      return res
        .status(200)
        .json({ message: 'Tao nguoi dung thanh cong', user: saveUser });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { phone, password } = req.body;
      const user = await User.findOne({
        phone,
      });

      if (!user) {
        return res.status(400).json({
          message: 'Nguoi dung khong ton tai',
        });
      }

      if (password !== user.password) {
        return res.status(400).json({
          message: 'Sai mat khau',
        });
      }

      return res.status(200).json({
        message: 'Login successful',
        user: { ...user._doc, password: '' },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = authController;
