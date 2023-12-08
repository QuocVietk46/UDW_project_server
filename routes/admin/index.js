const router = require('express').Router();

router.use('/admin/products', require('./productRouter'));
router.use('/admin/order', require('./orderRouter'));
router.use('/admin', require('./managerRouter'));

module.exports = router;
