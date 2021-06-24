const express = require('express');
const productsRouter = express.Router();
const authenticate = require('../authenticate');

const Products = require('../models/products');

// GET /products/own-products
productsRouter.get(
  '/own-products',
  authenticate.verifyUser,
  (req, res, next) => {
    Products.find({ seller: req.user._id })
      .populate('comments.author', '-_id -__v -phoneNumber -admin')
      .populate('seller', '-_id -__v -phoneNumber -admin')
      .then(
        (products) => {
          res.status(200).json({
            success: true,
            data: products,
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

// /products/
productsRouter
  .route('/')
  .get((req, res, next) => {
    Products.find(req.query)
      .populate('comments.author', '-_id -__v -phoneNumber -admin')
      .populate('seller', '-_id -__v -phoneNumber -admin')
      .then(
        (products) => {
          res.status(200).json({
            success: true,
            data: products,
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Products.create({ ...req.body, seller: req.user._id })
      .then(
        (product) => {
          console.log('Product created:', product);
          res
            .status(201)
            .json({ success: true, msg: 'Created product successfully!' });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Products.deleteMany({ seller: req.user._id })
      .then(
        () => {
          res
            .status(200)
            .json({ success: true, msg: 'Deleted all product successfully!' });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

// /products/:productId
productsRouter
  .route('/:productId')
  .get((req, res, next) => {
    Products.findById(req.params.productId)
      .populate('comments.author', '-_id -__v -phoneNumber -admin')
      .populate('seller', '-_id -__v -phoneNumber -admin')
      .then(
        (product) => {
          if (!product)
            return res.status(404).json({
              success: false,
              msg:
                'The product with id ' +
                req.params.productId +
                ' is not exist!',
            });

          res.status(200).json({ success: true, data: product });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Products.findById(req.params.productId)
      .then((product) => {
        if (!product)
          return res.status(404).json({
            success: false,
            msg:
              'The product with id ' + req.params.productId + ' is not exist!',
          });

        if (product.seller.toString() !== req.user._id.toString()) {
          return res
            .status(403)
            .json({ success: false, msg: 'This product is not yours!' });
        }

        Products.findByIdAndUpdate(
          req.params.productId,
          { $set: req.body },
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
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Products.findById(req.params.productId)
      .then((product) => {
        if (!product)
          return res.status(404).json({
            success: false,
            msg:
              'The product with id ' + req.params.productId + ' is not exist!',
          });

        if (product.seller.toString() !== req.user._id.toString()) {
          return res
            .status(403)
            .json({ success: false, msg: 'This product is not yours!' });
        }

        Products.findByIdAndDelete(req.params.productId).then(
          () =>
            res
              .status(200)
              .json({ success: true, msg: 'Deleted product successfully!' }),
          (err) => next(err)
        );
      })
      .catch((err) => next(err));
  });

// /products/:productId/comments
productsRouter
  .route('/:productId/comments')
  .get((req, res, next) => {
    Products.findById(req.params.productId)
      .populate('comments.author', '-_id -__v -phoneNumber -admin')
      .then((product) => {
        if (!product)
          return res.status(404).json({
            success: false,
            msg:
              'The product with id ' + req.params.productId + ' is not exist!',
          });

        res.status(200).json({ success: true, data: product.comments });
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Products.findById(req.params.productId)
      .then((product) => {
        if (!product)
          return res.status(404).json({
            success: false,
            msg:
              'The product with id ' + req.params.productId + ' is not exist!',
          });

        req.body.author = req.user._id;
        product.comments.push(req.body);

        product.save().then(
          () =>
            res.status(201).json({
              success: true,
              msg: 'Created comment successfully!',
            }),
          (err) => next(err)
        );
      })
      .catch((err) => next(err));
  });

// /products/:productId/comments/:commentId
productsRouter
  .route('/:productId/comments/:commentId')
  .get((req, res, next) => {
    Products.findById(req.params.productId)
      .populate('comments.author', '-_id -__v -phoneNumber -admin')
      .then((product) => {
        if (!product)
          return res.status(404).json({
            success: false,
            msg:
              'The product with id ' + req.params.productId + ' is not exist!',
          });

        let comment = product.comments.id(req.params.commentId);
        if (!comment)
          return res.status(404).json({
            success: false,
            msg:
              'The comment with id ' + req.params.commentId + ' is not exist!',
          });

        res.status(200).json({
          success: true,
          data: product.comments.id(req.params.commentId),
        });
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Products.findById(req.params.productId)
      .then((product) => {
        if (!product)
          return res.status(404).json({
            success: false,
            msg:
              'The product with id ' + req.params.productId + ' is not exist!',
          });

        let comment = product.comments.id(req.params.commentId);
        if (!comment) {
          return res.status(404).json({
            success: false,
            msg:
              'The comment with id ' + req.params.commentId + ' is not exist!',
          });
        }

        if (comment.author.toString() !== req.user._id.toString()) {
          return res.status(403).json({
            success: false,
            msg: 'Can only edit own comment!',
          });
        }

        if (req.body.rating) comment.rating = req.body.rating;
        if (req.body.comment) comment.comment = req.body.comment;

        product.save().then(
          () => {
            res
              .status(200)
              .json({ success: true, msg: 'Updated comment successfully!' });
          },
          (err) => next(err)
        );
      })
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Products.findById(req.params.productId)
      .then((product) => {
        if (!product)
          return res.status(404).json({
            success: false,
            msg:
              'The product with id ' + req.params.productId + ' is not exist!',
          });

        let comment = product.comments.id(req.params.commentId);
        if (!comment)
          return res.status(404).json({
            success: false,
            msg:
              'The comment with id ' + req.params.commentId + ' is not exist!',
          });

        if (comment.author.toString() !== req.user._id.toString()) {
          return res.status(403).json({
            success: false,
            msg: 'Can only delete own comment!',
          });
        }

        product.comments.id(req.params.commentId).remove();
        product.save().then(
          () => {
            res
              .status(200)
              .json({ success: true, msg: 'Deleted comment successfully!' });
          },
          (err) => next(err)
        );
      })
      .catch((err) => next(err));
  });

module.exports = productsRouter;
