const express = require('express');
const productsRouter = express.Router();

const Products = require('../models/products');

productsRouter
  .route('/')
  .get((req, res, next) => {
    res.status(200).json({ success: true, data: {} });
  })
  .post((req, res, next) => {
    res.status(200).json({ success: true, data: {} });
  })
  .delete((req, res, next) => {
    res.sendStatus(200);
  });

productsRouter
  .route('/:productId')
  .put((req, res, next) => {
    res.sendStatus(200);
  })
  .delete((req, res, next) => {
    res.sendStatus(200);
  });

module.exports = productsRouter;
