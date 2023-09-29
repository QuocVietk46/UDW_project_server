const router = require('express').Router();

const { authorization } = require('../../middlewares/authMiddleware');
const orderController = require('../../controllers/orderController');

router.get('/', authorization, orderController.getOrdersAdmin);
router.patch('/', authorization, orderController.updateOrder);

module.exports = router;
