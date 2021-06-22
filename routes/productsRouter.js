const express = require('express');
const productsRouter = express.Router();

const Products = require('../models/products');

// /products/
productsRouter
  .route('/')
  .get((req, res, next) => {
    Products.find({})
      .then(
        (products) => {
          res.status(200).json({ success: true, data: products });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Products.create(req.body)
      .then(
        (product) => {
          console.log('Product created:', product);
          res.status(201).json(product);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Products.deleteMany({})
      .then(
        (response) => {
          res.status(200).json(response);
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

          res.status(200).json(product);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    Products.findByIdAndUpdate(
      req.params.productId,
      { $set: req.body },
      { new: true }
    )
      .then((product) => {
        if (!product)
          return res.status(404).json({
            success: false,
            msg:
              'The product with id ' + req.params.productId + ' is not exist!',
          });

        res.status(200).json(product);
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Products.findByIdAndDelete(req.params.productId)
      .then(
        (response) => {
          res.status(200).json(response);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

// /products/:productId/comments
productsRouter
  .route('/:productId/comments')
  .get((req, res, next) => {
    Products.findById(req.params.productId)
      .then((product) => {
        if (!product)
          return res.status(404).json({
            success: false,
            msg:
              'The product with id ' + req.params.productId + ' is not exist!',
          });

        res.status(200).json(product.comments);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Products.findById(req.params.productId)
      .then((product) => {
        if (!product)
          return res.status(404).json({
            success: false,
            msg:
              'The product with id ' + req.params.productId + ' is not exist!',
          });

        product.comments.push(req.body);
        product.save().then(
          (product) => {
            res.status(201).json(product);
          },
          (err) => next(err)
        );
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Products.findById(req.params.productId)
      .then((product) => {
        if (!product)
          return res.status(404).json({
            success: false,
            msg:
              'The product with id ' + req.params.productId + ' is not exist!',
          });

        product.comments = [];
        product
          .save()
          .then(
            (product) => {
              res.status(200).json(product);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  });

// /products/:productId/comments/:commentId
productsRouter
  .route('/:productId/comments/:commentId')
  .get((req, res, next) => {
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

        res.status(200).json(product.comments.id(req.params.commentId));
      })
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
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

        if (req.body.rating) comment.rating = req.body.rating;
        if (req.body.comment) comment.comment = req.body.comment;

        product.save().then(
          (product) => {
            res.status(200).json(product);
          },
          (err) => next(err)
        );
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
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

        product.comments.id(req.params.commentId).remove();
        product.save().then(
          (product) => {
            res.status(200).json(product);
          },
          (err) => next(err)
        );
      })
      .catch((err) => next(err));
  });

module.exports = productsRouter;
