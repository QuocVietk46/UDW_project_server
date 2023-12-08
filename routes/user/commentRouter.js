const router = require('express').Router();

const { authentication } = require('../../middlewares/authMiddleware');
const commentController = require('../../controllers/commentController');

router.get('/:productId', commentController.getComments);
router.post('/', authentication, commentController.addComment);
router.patch('/', authentication, commentController.updateComment);
router.delete('/', authentication, commentController.deleteComment);

module.exports = router;
