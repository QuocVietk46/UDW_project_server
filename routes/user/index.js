const router = require('express').Router();

const { authentication } = require('../../middlewares/authMiddleware');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');
const rateRouter = require('./rateRouter');
const commentRouter = require('./commentRouter');
const orderRouter = require('./orderRouter');
const profileRouter = require('./profileRouter');

router.use('/products', productRouter);
router.use('/cart', authentication, cartRouter);
router.use('/rate', rateRouter);
router.use('/comment', commentRouter);
router.use('/order', authentication, orderRouter);
router.use('/profile', authentication, profileRouter);

module.exports = router;
