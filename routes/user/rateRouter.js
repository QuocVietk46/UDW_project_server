const router = require('express').Router();

const { authentication } = require('../../middlewares/authMiddleware');
const rateController = require('../../controllers/rateController');

router.post('/', authentication, rateController.addRate);
router.patch('/', authentication, rateController.updateRate);
router.delete('/', authentication, rateController.deleteRate);
router.get('/', authentication, rateController.getRate);

module.exports = router;
