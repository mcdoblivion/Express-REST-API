const Products = require('../models/products');
const Comments = require('../models/comments');
const fs = require('fs');

module.exports.getProducts = (req, res, next) => {
  Products.find(
    req.query.search ? { $text: { $search: req.query.search } } : {}
  )
    .populate('seller', '-__v -phoneNumber -admin -address')
    .then((products) => {
      res.status(200).json({
        success: true,
        data: products,
      });
    })
    .catch((err) => next(err));
};

module.exports.createProduct = (req, res, next) => {
  Products.create({ ...req.body, seller: req.user._id })
    .then((product) => {
      console.log('Product created:', product);
      res
        .status(201)
        .json({ success: true, msg: 'Created product successfully!' });
    })
    .catch((err) => next(err));
};

module.exports.deleteProducts = async (req, res, next) => {
  try {
    let deletedCount = 0;
    if (req.body) {
      for (product of req.body) {
        const foundProduct = await Products.findOneAndRemove({
          seller: req.user._id,
          _id: product,
        });
        if (foundProduct) deletedCount++;
      }
    } else {
      const products = await Products.find({ seller: req.user._id });
      deletedCount = products.length;
      for (const product of products) {
        await Comments.deleteMany({ product: product._id });
        product.images.forEach((image) => {
          fs.unlink(`public/${image}`, (err) => console.log('Error:', err));
        });
        await product.remove();
      }
    }
    res.status(200).json({
      success: true,
      msg: `Deleted ${deletedCount} products successfully!`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getOwnProducts = (req, res, next) => {
  Products.find({ seller: req.user._id })
    .then((products) => {
      res.status(200).json({
        success: true,
        data: products,
      });
    })
    .catch((err) => next(err));
};

module.exports.getProductById = (req, res, next) => {
  Products.findById(req.params.productId)
    .populate('seller', '-__v -admin -address')
    .then((product) => {
      if (!product) {
        const err = new Error(
          'The product with id ' + req.params.productId + ' is not exist!'
        );
        err.status = 404;
        next(err);
      }

      res.status(200).json({ success: true, data: product });
    })
    .catch((err) => next(err));
};

module.exports.updateProduct = (req, res, next) => {
  Products.findById(req.params.productId)
    .then((product) => {
      if (!product) {
        const err = new Error(
          'The product with id ' + req.params.productId + ' is not exist!'
        );
        err.status = 404;
        next(err);
      }

      if (product.seller.toString() !== req.user._id.toString()) {
        const err = new Error('This product is not yours!');
        err.status = 403;
        next(err);
      }

      Products.findByIdAndUpdate(
        req.params.productId,
        { $set: { ...req.body, rating: product.rating } },
        { new: true }
      ).then(
        () =>
          res
            .status(200)
            .json({ success: true, msg: 'Updated product successfully!' }),
        (err) => next(err)
      );
    })
    .catch((err) => next(err));
};

module.exports.deleteProduct = (req, res, next) => {
  Products.findById(req.params.productId)
    .then((product) => {
      if (!product) {
        const err = new Error(
          'The product with id ' + req.params.productId + ' is not exist!'
        );
        err.status = 404;
        next(err);
      }

      if (product.seller.toString() !== req.user._id.toString()) {
        const err = new Error('This product is not yours!');
        err.status = 403;
        next(err);
      }

      Products.findByIdAndDelete(req.params.productId).then(
        (product) => {
          Comments.deleteMany({ product: product._id })
            .then(() => {
              console.log('Deleted relative comments!');
            })
            .catch((err) => next(err));

          product.images.forEach((image) => {
            fs.unlink(`public/${image}`, (err) => console.log(err));
          });

          return res
            .status(200)
            .json({ success: true, msg: 'Deleted product successfully!' });
        },
        (err) => next(err)
      );
    })
    .catch((err) => next(err));
};
