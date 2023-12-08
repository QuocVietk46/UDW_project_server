const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

const authController = {
  register: async (req, res) => {
    try {
      const { full_name, password, email } = req.body;
      if (!full_name || !password || !email) {
        return res.status(400).json({
          message: 'Please fill all required fields',
        });
      }

      const existUser = await User.findOne({ email });
      if (existUser) {
        return res.status(400).json({
          message: 'User already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        full_name: full_name.trim(),
        password: hashedPassword,
        email,
      });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/api/auth/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        message: 'User created successfully',
        accessToken: 'Bearer ' + accessToken,
        user,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          message: 'User not found',
        });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({
          message: 'Password is incorrect',
        });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/api/auth/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        user,
        accessToken: 'Bearer ' + accessToken,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie('refreshToken', { path: '/api/auth/refresh_token' });
      return res.status(200).json({
        message: 'Logged out',
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(400).json({
          message: 'Please login now',
        });
      }

      jwt.verify(refreshToken, process.env.TOKEN_SECRET, (error, user) => {
        if (error) {
          return res.status(400).json({
            message: 'Please login now',
          });
        }

        const accessToken = generateAccessToken(user);

        res.header('authorization', accessToken);

        res.status(200).json({
          accessToken,
        });
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  },
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      role: user.role,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: '1d' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      role: user.role,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = authController;
