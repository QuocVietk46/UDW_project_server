const router = require('express').Router();
const authController = require('../controllers/authController');

router.get('/auth/register', authController.register);
router.get('/auth/login', authController.login);

module.exports = router;
