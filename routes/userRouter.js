const router = require('express').Router();
const userController = require('../controllers/userController');

router.patch('/user/addProduct', userController.addProductToCart);
router.patch('/user/removeProduct', userController.removeProductFromCart);
router.get('/user/allProduct', userController.getAllProduct);
router.get('/user/cart', userController.getCart);

module.exports = router;
