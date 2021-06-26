const express = require('express');
const cartsRouter = express.Router();
const authenticate = require('../authenticate');
const Carts = require('../models/carts');
const Products = require('../models/products');

cartsRouter.use(authenticate.verifyUser);

// /carts/
cartsRouter
  .route('/')
  .get((req, res, next) => {
    Carts.findOne({ user: req.user._id })
      .populate('products.product')
      .then(
        (cart) => {
          if (!cart) {
            cart = new Carts({ user: req.user._id });
            return res.status(200).json({ success: true, data: cart });
          }

          cart.save((err, cart) => {
            if (err) next(err);
            cart.populate('user');

            return res.status(200).json({ success: true, data: cart });
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Carts.findOne({ user: req.user._id })
      .then(
        (cart) => {
          if (!cart) {
            cart = new Carts({ user: req.user._id });
          }

          Products.find({})
            .then(
              (allProducts) => {
                const listProducts = req.body;
                const productsQuantityValid = listProducts.every((products) => {
                  const numberInStock = allProducts.find(
                    (product) =>
                      product._id.toString() === products.product.toString()
                  ).numberInStock;

                  const existProduct = cart.products.find(
                    (product) => product.product == products.product
                  );
                  if (!existProduct) {
                    if (products.quantity > numberInStock) {
                      return false;
                    } else {
                      cart.products.push(products);
                      return true;
                    }
                  } else {
                    if (
                      existProduct.quantity + products.quantity >
                      numberInStock
                    ) {
                      return false;
                    } else {
                      existProduct.quantity += products.quantity;
                      return true;
                    }
                  }
                });

                if (!productsQuantityValid) {
                  return res.status(400).json({
                    success: false,
                    msg: 'Cart can not has more products than number in stock!',
                  });
                } else {
                  cart.save((err, cart) => {
                    if (err) next(err);
                    return res.status(201).json({
                      success: true,
                      msg: 'Add products to cart successfully!',
                    });
                  });
                }
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Carts.findOne({ user: req.user._id })
      .populate('user')
      .then(
        (cart) => {
          if (!cart) {
            cart = new Carts({ user: req.user._id });
            return res.status(200).json({
              success: true,
              msg: 'Delete all products successfully!',
            });
          }

          cart.products = [];
          cart.save().then(
            () =>
              res.status(200).json({
                success: true,
                msg: 'Deleted all products successfully!',
              }),
            (err) => next(err)
          );
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

// /carts/:productId
cartsRouter
  .route('/:productId')
  .delete((req, res, next) => {
    Carts.findOne({ user: req.user._id })
      .then(
        (cart) => {
          if (!cart) {
            return res.status(404).json({ success: false, msg: 'Cart empty!' });
          }

          const existProduct = cart.products.find((product) => {
            return product.product == req.params.productId;
          });
          if (!existProduct) {
            return res
              .status(404)
              .json({ success: false, msg: 'Cart do not has this product!' });
          }
          cart.products.splice(cart.products.indexOf(existProduct), 1);

          cart.save().then(
            () =>
              res.status(200).json({
                success: true,
                msg: 'Deleted product ' + req.params.productId + ' from cart!',
              }),
            (err) => next(err)
          );
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    Carts.findOne({ user: req.user._id })
      .then(
        (cart) => {
          if (!cart) {
            return res.status(404).json({ success: false, msg: 'Cart empty!' });
          }

          const existProduct = cart.products.find((product) => {
            return product.product == req.params.productId;
          });
          if (!existProduct) {
            return res
              .status(404)
              .json({ success: false, msg: 'Cart do not has this product!' });
          }
          existProduct.quantity = req.body.quantity;

          cart.save().then(
            () =>
              res.status(200).json({
                success: true,
                msg: 'Updated product ' + req.params.productId + ' in cart!',
              }),
            (err) => next(err)
          );
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = cartsRouter;
