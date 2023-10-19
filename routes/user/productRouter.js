const router = require('express').Router();

const productController = require('../../controllers/productController');

router.get('/', productController.findProduct);
router.get('/:id', productController.findById);

module.exports = router;
