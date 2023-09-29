const router = require('express').Router();

const cartController = require('../../controllers/cartController');
const { authentication } = require('../../middlewares/authMiddleware');

router.post('/', authentication, cartController.addProductToCart);
router.patch('/', authentication, cartController.updateCart);
router.get('/', authentication, cartController.getCart);

module.exports = router;
