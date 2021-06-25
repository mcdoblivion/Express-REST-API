const express = require('express');
const ordersRouter = express.Router();

const authenticate = require('../authenticate');
const orderValidator = require('../middlewares/orderValidator');

const Orders = require('../models/orders');
const Products = require('../models/products');

// /orders
ordersRouter.post('/', orderValidator.validateOrder, (req, res, next) => {
  Orders.create(req.body)
    .then(
      () => {
        Products.find({}).then((allProducts) => {
          req.body.products.forEach((products) => {
            let foundProduct = allProducts.find(
              (product) =>
                product._id.toString() === products.product.toString()
            );

            foundProduct.numberInStock -= products.quantity;
            foundProduct.save();
          });
        });

        return res.status(201).json({
          success: true,
          msg: 'Order is successful, wait for seller to confirm',
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

// /orders/buy-orders
ordersRouter.get('/buy-orders', authenticate.verifyUser, (req, res, next) => {
  Orders.find(req.query)
    .populate('customer.user', '-admin -_id -__v')
    .populate('products.product')
    .then(
      (orders) => {
        return res.status(200).json({
          success: true,
          data: orders.filter(
            (order) =>
              order.customer.user._id.toString() === req.user._id.toString()
          ),
        });
      },
      (err) => next(err)
    );
});

// /orders/sell-orders
ordersRouter.get('/sell-orders', authenticate.verifyUser, (req, res, next) => {
  Orders.find(req.query)
    .populate('customer.user', '-admin -_id -__v -username')
    .populate('products.product')
    .then(
      (orders) => {
        return res.status(200).json({
          success: true,
          data: orders.filter(
            (order) => order.seller.toString() === req.user._id.toString()
          ),
        });
      },
      (err) => next(err)
    );
});

// /orders/:orderId/cancel
ordersRouter.put(
  '/orders/:orderId/cancel',
  authenticate.verifyUser,
  (req, res, next) => {
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
            order.status = -1;
            order.save().then(
              () =>
                res
                  .status(200)
                  .json({ success: true, msg: 'Order canceled successfully!' }),
              (err) => next(err)
            );
          } else if (order.status === 1) {
            return res
              .status(403)
              .json({ success: false, msg: 'This order has been delivered!' });
          } else {
            return res
              .status(403)
              .json({ success: false, msg: 'This order has been canceled!' });
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

// /orders/:orderId/confirm
ordersRouter.put(
  '/orders/:orderId/confirm',
  authenticate.verifyUser,
  (req, res, next) => {
    Orders.findById(req.params.orderId)
      .then(
        (order) => {
          if (order.seller.toString() !== req.user._id.toString()) {
            return res
              .status(403)
              .json({ success: false, msg: 'This order is not yours!' });
          }

          if (order.status === 0) {
            order.status = 1;
            order.save().then(
              () =>
                res.status(200).json({
                  success: true,
                  msg: 'Order confirmed successfully!',
                }),
              (err) => next(err)
            );
          } else if (order.status === 1) {
            return res
              .status(403)
              .json({ success: false, msg: 'This order has been delivered!' });
          } else {
            return res
              .status(403)
              .json({ success: false, msg: 'This order has been canceled!' });
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

module.exports = ordersRouter;
