const router = require('express').Router();

const managerController = require('../../controllers/managerController');

router.get('/', managerController.dashBoard);
router.get('/users', managerController.getUser);
router.get('/profit', managerController.getProfit);

module.exports = router;
