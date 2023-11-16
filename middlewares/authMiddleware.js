const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = {
  authentication: async (req, res, next) => {
    try {
      const checkToken = req.header('Authorization');
      if (!checkToken) {
        return res.status(401).json({
          message: 'Invalid Token',
        });
      }

      const token = checkToken.split(' ')[1];

      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      const user = await User.findOne({ _id: decoded._id });
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        message: error.message,
      });
    }
  },
  authorization: (req, res, next) => {
    try {
      const checkToken = req.header('Authorization');

      if (!checkToken) {
        return res.status(401).json({
          message: 'Invalid Token',
        });
      }
      const token = checkToken.split(' ')[1];
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      if (decoded.role !== 'admin') {
        return res.status(403).json({
          message: 'You are not authorized',
        });
      }
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = authMiddleware;
