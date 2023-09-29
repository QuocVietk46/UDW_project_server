const router = require('express').Router();

const productController = require('../../controllers/productController');
const { authorization } = require('../../middlewares/authMiddleware');
const upload = require('../../configs/multer');

router.get('/', authorization, productController.findProduct);
router.get('/:id', authorization, productController.findById);
router.post(
  '/',
  authorization,
  upload.array('images', 10),
  productController.addProduct
);
router.patch(
  '/:id',
  authorization,
  upload.array('images', 10),
  productController.updateProduct
);
router.delete('/', authorization, productController.deleteProduct);

module.exports = router;
