const router = require('express').Router();

const { authentication } = require('../../middlewares/authMiddleware');
const orderController = require('../../controllers/orderController');

router.get('/', authentication, orderController.getOrders);
router.post('/', authentication, orderController.addOrder);
router.delete('/', authentication, orderController.deleteOrder);

module.exports = router;
