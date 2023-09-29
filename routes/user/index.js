const router = require('express').Router();

const { authentication } = require('../../middlewares/authMiddleware');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');
const rateRouter = require('./rateRouter');
const commentRouter = require('./commentRouter');

router.use('/products', authentication, productRouter);
router.use('/cart', authentication, cartRouter);
router.use('/rate', authentication, rateRouter);
router.use('/comment', authentication, commentRouter);

module.exports = router;
