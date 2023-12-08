const router = require('express').Router();

const { authentication } = require('../../middlewares/authMiddleware');
const orderController = require('../../controllers/orderController');

// router.post('/DetailPayment', orderController.);

router.post('/payment_vnpay_return', orderController.addOrder);
router.get('/', authentication, orderController.getOrders);
router.post('/', authentication, orderController.addOrder);
router.post('/payment_vnpay', authentication, orderController.addOrderByVNPay);
router.patch('/:id', authentication, orderController.updateOrder);

module.exports = router;
