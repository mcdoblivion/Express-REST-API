const express = require('express');
const ordersRouter = express.Router();

const authenticate = require('../authenticate');
const orderValidator = require('../middlewares/orderValidator');
const Carts = require('../models/carts');

const Orders = require('../models/orders');
const Products = require('../models/products');

// /orders[?status=-1/0/1, sellOrder=true]
ordersRouter
  .route('/')
  .get(authenticate.verifyUser, (req, res, next) => {
    let status = {};
    if (req.query.status) status = { status: req.query.status };

    Orders.find(status)
      .populate('customer.user', '-admin -__v')
      .populate('seller', '-admin -__v')
      .populate('products.product')
      .then(
        (orders) => {
          return res.status(200).json({
            success: true,
            data: orders.filter((order) => {
              if (req.query.sellOrder === 'true') {
                return order.seller._id.toString() === req.user._id.toString();
              }
              return (
                order.customer.user._id.toString() === req.user._id.toString()
              );
            }),
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(orderValidator.validateOrder, (req, res, next) => {
    Orders.create(req.body)
      .then((order) => {
        Products.find({})
          .then((allProducts) => {
            req.body.products.forEach((products) => {
              let foundProduct = allProducts.find(
                (product) =>
                  product._id.toString() === products.product.toString()
              );
              foundProduct.numberInStock -= products.quantity;
              foundProduct.save();
            });

            console.log('Saved products!');
          })
          .catch((err) => next(err));

        Carts.findOne({ user: req.user._id })
          .then((cart) => {
            if (cart.products) {
              req.body.products.forEach((products) => {
                let foundProduct = cart.products.find(
                  (cartProducts) =>
                    cartProducts.product.toString() ===
                    products.product.toString()
                );
                if (foundProduct) foundProduct.remove();
              });

              cart.save();
              console.log('Saved cart!');
            }
          })
          .catch((err) => next(err));

        console.log('Order created!');
        return res.status(201).json({
          success: true,
          msg: 'Order is successful, wait for seller to confirm',
          data: { orderId: order._id },
        });
      })
      .catch((err) => next(err));
  });

// /orders/:orderId[?operation=cancel/confirm]
ordersRouter
  .route('/:orderId')
  .get((req, res, next) => {
    Orders.findById(req.params.orderId)
      .populate('customer.user', '-admin -__v')
      .populate('seller', '-admin -__v')
      .populate('products.product')
      .then(
        (order) => {
          return res.status(200).json({
            success: true,
            data: order,
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    if (req.query.operation !== 'cancel' || req.query.operation !== 'confirm') {
      res
        .status(400)
        .json({ success: false, msg: 'Operation must be cancel/confirm!' });
    }
    Orders.findById(req.params.orderId)
      .then(
        (order) => {
          if (
            order.customer.user.toString() !== req.user._id.toString() &&
            order.seller.toString() !== req.user._id.toString()
          ) {
            return res
              .status(403)
              .json({ success: false, msg: 'This order is not yours!' });
          }

          if (order.status === 0) {
            if (req.query.operation === 'cancel') {
              Products.find({ seller: order.seller })
                .then(
                  (allProducts) => {
                    order.products.forEach((products) => {
                      let foundProduct = allProducts.find(
                        (product) =>
                          product._id.toString() === products.product.toString()
                      );

                      foundProduct.numberInStock += products.quantity;
                      foundProduct.save();
                    });
                    console.log('Saved products!');
                  },
                  (err) => next(err)
                )
                .catch((err) => next(err));

              order.status = -1;
              order.save().then(
                () =>
                  res.status(200).json({
                    success: true,
                    msg: 'Order canceled successfully!',
                  }),
                (err) => next(err)
              );
            } else {
              if (order.seller.toString() !== req.user._id.toString()) {
                return res
                  .status(403)
                  .json({ success: false, msg: 'This order is not yours!' });
              } else {
                order.status = 1;
                order.save().then(
                  () =>
                    res.status(200).json({
                      success: true,
                      msg: 'Order confirmed successfully!',
                    }),
                  (err) => next(err)
                );
              }
            }
          } else if (order.status === 1) {
            return res.status(403).json({
              success: false,
              msg: 'This order has been delivered!',
            });
          } else {
            return res
              .status(403)
              .json({ success: false, msg: 'This order has been canceled!' });
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = ordersRouter;
