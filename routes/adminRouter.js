const router = require('express').Router();
const productController = require('../controllers/productController');

router.post('/admin/addProduct', productController.addProduct);

module.exports = router;
