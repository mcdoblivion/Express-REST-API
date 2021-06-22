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
    res.sendStatus(200);
  });

module.exports = productsRouter;
