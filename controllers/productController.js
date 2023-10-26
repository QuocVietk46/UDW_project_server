const Product = require('../models/productModel');
const Image = require('../models/imageModel');
const fs = require('fs');
const { default: mongoose } = require('mongoose');
const { log } = require('console');

const productController = {
  addProduct: async (req, res) => {
    try {
      const { title, price, quantity, describe, category, status } = req.body;
      const files = req.files;

      if (
        !title ||
        !price ||
        files.length === 0 ||
        !quantity ||
        !describe ||
        !category
      ) {
        files.forEach((file) => {
          removeImageLocal(file.filename);
        });
        return res.status(400).json({
          error: 'Please fill all required fields',
        });
      }

      const product = new Product({
        title: title.trim(),
        price,
        quantity: parseInt(quantity),
        describe: describe.trim(),
        category: category.trim(),
        status: status.trim(),
      });

      for (let i = 0; i < files.length; i++) {
        const image = await Image.create({
          // 'public\\images\\image-1619797876169.jpg' => 'public/images/image-1619797876169.jpg'
          path: '/' + files[i].path.replace(/\\/g, '/'),
          product: product._id,
          filename: files[i].filename,
        });
        product.images.push(image);
      }

      await product.save();

      return res.status(200).json({
        product: product,
      });
    } catch (error) {
      req.files?.forEach((file) => {
        removeImageLocal(file.filename);
      });
      return res.status(500).json({ message: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const {
        title,
        price,
        quantity,
        describe,
        deleteI,
        sale,
        status,
        category,
      } = req.body;
      const files = req.files;
      console.log({ files });
      const { id } = req.params;
      const deleteImages = deleteI?.split(',');

      if (
        !title &&
        !price &&
        files.length === 0 &&
        !quantity &&
        !describe &&
        !deleteImages &&
        !sale &&
        !status &&
        !category
      ) {
        files?.forEach((file) => {
          removeImageLocal(file.filename);
        });

        return res.status(400).json({
          error: 'Nothing to update',
        });
      }

      const product = await Product.findById(id).populate('images');
      if (!product) {
        files?.forEach((file) => {
          removeImageLocal(file.filename);
        });
        return res.status(400).json({
          error: 'Product not found',
        });
      }
      if (title) {
        product.title = title;
      }
      if (price) {
        product.price = price;
      }
      if (quantity) {
        product.quantity = quantity;
      }
      if (describe) {
        product.describe = describe;
      }
      if (sale) {
        product.sale = sale;
      }
      if (status) {
        product.status = status;
      }
      if (category) {
        product.category = category;
      }
      if (deleteImages) {
        for (let i = 0; i < deleteImages.length; i++) {
          product.images.filter((image) => image._id !== deleteImages[i]);
          const image = await Image.findByIdAndDelete(deleteImages[i]);
          removeImageLocal(image.filename);
        }
      }

      files?.forEach(async (file) => {
        const image = await Image.create({
          path: '/' + file.path.replace(/\\/g, '/'),
          product: product._id,
          filename: file.filename,
        });
        product.images.push(image);
      });

      await product.save();

      return res.status(200).json({
        product: product,
      });
    } catch (error) {
      req.files?.forEach((file) => {
        removeImageLocal(file.filename);
      });
      return res.status(500).json({ message: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { productIds } = req.body;

      if (!productIds) {
        return res.status(400).json({
          error: 'Please provide product ids',
        });
      }

      // delete images product in DB
      for (let i = 0; i < productIds.length; i++) {
        const product = await Product.findByIdAndDelete(productIds[i]).populate(
          'images'
        );
        if (!product) {
          return res.status(400).json({
            error: 'Product not found',
          });
        }
        await Image.deleteMany({ product: productIds[i] });
        product.images.forEach((image) => {
          removeImageLocal(image.filename);
        });
      }

      return res.status(200).json({
        message: 'Product deleted successfully',
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  findProduct: async (req, res) => {
    try {
      const page = parseInt(req.query.page) - 1 || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      let status = req.query.status || 'available';
      let sort = req.query.sort || 'price';
      let subSort = req.query.subSort || 'inc';
      let category = req.query.category || 'all';

      status !== 'available' ? (status = req.query.status.split(',')) : '';

      let cateArr = ['t-shirt', 'jeans', 'short', 'pant', 'jacket'];

      category === 'all'
        ? (category = [...cateArr])
        : (category = req.query.category.split(','));

      let sortBy = {};
      if (sort === 'price' && subSort === 'inc') {
        sortBy.price = 1;
      } else if (sort === 'price' && subSort === 'dec') {
        sortBy.price = -1;
      } else if (sort === 'title' && subSort === 'inc') {
        sortBy.title = 1;
      } else if (sort === 'title' && subSort === 'dec') {
        sortBy.title = -1;
      } else if (sort === 'createdAt' && subSort === 'inc') {
        sortBy.createdAt = 1;
      } else if (sort === 'createdAt' && subSort === 'dec') {
        sortBy.createdAt = -1;
      }

      const products = await Product.find()
        .where('status')
        .in(status)
        .where('title')
        .regex(new RegExp(search.trim(), 'i'))
        .where('category')
        .in(category)
        .sort(sortBy)
        .skip(page * limit)
        .limit(limit)
        .populate('images');

      const total = await Product.countDocuments({
        status: { $in: status },
        title: { $regex: search.trim(), $options: 'i' },
        category: { $in: category },
      });

      return res.status(200).json({
        total: total,
        page: page + 1,
        limit: limit,
        products: products,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  findById: async (req, res) => {
    try {
      const { id } = req.params;
      console.log({ id });
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          error: 'Please provide product id',
        });
      }

      const product = await Product.findById(id).populate('images');

      if (!product) {
        return res.status(400).json({
          error: 'Product not found',
        });
      }

      return res.status(200).json({
        product: product,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

const removeImageLocal = (filename) => {
  fs.unlink(`public\\images\\${filename}`, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = productController;
