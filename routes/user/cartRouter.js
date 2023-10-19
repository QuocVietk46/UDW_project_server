const router = require('express').Router();

const cartController = require('../../controllers/cartController');
const { authentication } = require('../../middlewares/authMiddleware');

router.get('/', authentication, cartController.getCart);
router.post('/', authentication, cartController.addProductToCart);
router.patch('/', authentication, cartController.updateCart);
router.delete('/:id', authentication, cartController.removeProductInCart);
router.delete('/', authentication, cartController.clearCart);

module.exports = router;
