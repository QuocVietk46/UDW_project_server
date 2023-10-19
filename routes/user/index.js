const router = require('express').Router();

const { authentication } = require('../../middlewares/authMiddleware');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');
const rateRouter = require('./rateRouter');
const commentRouter = require('./commentRouter');
const orderRouter = require('./orderRouter');

router.use('/products', productRouter);
router.use('/cart', authentication, cartRouter);
router.use('/rate', authentication, rateRouter);
router.use('/comment', authentication, commentRouter);
router.use('/order', authentication, orderRouter);

module.exports = router;
