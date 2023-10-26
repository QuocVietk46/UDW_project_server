const jwt = require('jsonwebtoken');

const authMiddleware = {
  authentication: async (req, res, next) => {
    try {
      const checkToken = req.header('Authorization');
      if (!checkToken) {
        return res.status(401).json({
          error: 'Invalid Token',
        });
      }

      const token = checkToken.split(' ')[1];

      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  },
  authorization: (req, res, next) => {
    try {
      const checkToken = req.header('Authorization');

      if (!checkToken) {
        return res.status(401).json({
          error: 'please login',
        });
      }
      const token = checkToken.split(' ')[1];
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      if (decoded.role !== 'admin') {
        return res.status(403).json({
          error: 'You are not authorized',
        });
      }
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
};

module.exports = authMiddleware;
