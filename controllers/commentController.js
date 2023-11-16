const { isValidObjectId } = require('mongoose');
const Comment = require('../models/commentModel');
const Product = require('../models/productModel');
const Rate = require('../models/rateModel');

const commentController = {
  addComment: async (req, res) => {
    try {
      const { productId, comment } = req.body;
      const user = req.user;

      if (!productId || !comment) {
        return res.status(400).json({
          message: 'Please fill all required fields',
        });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({
          message: 'Product not found',
        });
      }

      const rate = await Rate.findOne({ productId, userId: user._id });
      console.log(req.body);

      const newComment = new Comment({
        productId,
        userId: user._id,
        comment,
        rate: rate?._id || null,
      });

      await newComment.save();

      return res.status(200).json({
        message: 'Add comment successfully',
        newComment: {
          ...newComment._doc,
          userId: { ...user._doc, password: '' },
        },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateComment: async (req, res) => {
    try {
      const { commentId, comment } = req.body;
      const userId = req.user._id;

      const commentProduct = await Comment.findOne({ _id: commentId, userId });
      if (!commentProduct) {
        return res.status(400).json({
          message: 'You have not commented this product yet',
        });
      }

      commentProduct.comment = comment;
      await commentProduct.save();

      return res.status(200).json({
        message: 'Update comment successfully',
        commentProduct: commentProduct,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user._id;

      const commentProduct = await Comment.findOneAndDelete({
        _id: commentId,
        userId,
      });
      if (!commentProduct) {
        return res.status(400).json({
          message: 'You have not commented this product yet',
        });
      }

      return res.status(200).json({
        message: 'Delete comment successfully',
        commentProduct: commentProduct,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getComments: async (req, res) => {
    try {
      const { productId } = req.params;

      const comments = await Comment.find({ productId }).populate({
        path: 'userId',
        select: 'full_name',
      });

      return res.status(200).json({
        message: 'Get comments successfully',
        comments: comments,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = commentController;
