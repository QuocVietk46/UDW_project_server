const User = require('../models/userModel');

const profileController = {
  getProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({
          message: 'User not found',
        });
      }

      res.status(200).json({
        message: 'Get user successfully',
        user: user,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      const { name, email, phone, address, addressDelete } = req.body;

      if (!name && !email && !phone && !address && !addressDelete) {
        return res.status(400).json({
          message: 'Nothing to update',
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({
          message: 'User not found',
        });
      }
      if (name) {
        user.name = name;
      }
      if (email) {
        user.email = email;
      }
      if (phone) {
        user.phone = phone;
      }
      if (address) {
        user.address = [...user.address, address];
      }
      if (addressDelete) {
        user.address = user.address.filter((item) => item !== addressDelete);
      }
      await user.save();

      res.status(200).json({
        message: 'Update user successfully',
        user: user,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = profileController;
