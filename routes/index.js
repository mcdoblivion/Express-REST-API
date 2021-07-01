const express = require('express');
const router = express.Router();

const usersRouter = require('./users');
const productsRouter = require('./productsRouter');
const cartsRouter = require('./cartsRouter');
const ordersRouter = require('./ordersRouter');
const uploadRouter = require('./uploadRouter');

router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/carts', cartsRouter);
router.use('/orders', ordersRouter);
router.use('/upload-image', uploadRouter);

module.exports = router;
