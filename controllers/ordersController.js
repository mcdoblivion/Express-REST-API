const config = require('../config');
const CartItems = require('../models/cartItems');
const OrderItems = require('../models/orderItems');
const Orders = require('../models/orders');
const Products = require('../models/products');

module.exports.getOrders = (req, res, next) => {
  let status = {};
  if (req.query.status) status = { status: req.query.status };

  Orders.find(status)
    .then((orders) => {
      const ordersFiltered = req.query.sellOrder
        ? orders.filter((order) => order.seller === req.user._id)
        : orders.filter((order) => order.customer === req.user._id);

      const result = ordersFiltered.map(async (order) => {
        const orderItems = await OrderItems.find({ order: order._id }).populate(
          'product'
        );
        return { ...order, orderItems: orderItems };
      });

      return res.status(200).json({ success: true, data: result });
    })
    .catch((err) => next(err));
};

module.exports.createOrder = (req, res, next) => {
  Orders.create({ ...req.body, status: config.productStatus.waitSellerConfirm })
    .then((order) => {
      console.log('Order created!');

      req.body.orderItems.forEach(async (item) => {
        const product = await Products.findById(item.product);
        product.numberInStock -= item.quantity;
        product.save();
        OrderItems.create({ ...item, order: order._id });
      });

      return res.status(201).json({
        success: true,
        msg: 'Order is successful, wait for seller to confirm',
      });
    })
    .catch((err) => next(err));
};

module.exports.getOrderById = (req, res, next) => {
  Orders.findById(req.params.orderId)
    .then(async (order) => {
      const orderItems = await OrderItems.find({ order: order._id }).populate(
        'product'
      );

      return res.status(200).json({
        success: true,
        data: { ...order, orderItems: orderItems },
      });
    })
    .catch((err) => next(err));
};

module.exports.updateOrderStatus = (req, res, next) => {
  if (req.query.operation !== 'cancel' || req.query.operation !== 'confirm') {
    res
      .status(400)
      .json({ success: false, msg: 'Operation must be cancel/confirm!' });
  }
  Orders.findById(req.params.orderId)
    .then((order) => {
      if (
        order.customer.user.toString() !== req.user._id.toString() &&
        order.seller.toString() !== req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({ success: false, msg: 'This order is not yours!' });
      }

      if (order.status === config.productStatus.waitSellerConfirm) {
        if (req.query.operation === 'cancel') {
          Products.find({ seller: order.seller })
            .then((allProducts) => {
              order.products.forEach((products) => {
                let foundProduct = allProducts.find(
                  (product) =>
                    product._id.toString() === products.product.toString()
                );

                foundProduct.numberInStock += products.quantity;
                foundProduct.save();
              });
              console.log('Saved products!');

              order.status = config.productStatus.orderCanceled;
              return order.save();
            })
            .then(() =>
              res.status(200).json({
                success: true,
                msg: 'Order canceled successfully!',
              })
            )
            .catch((err) => next(err));
        } else {
          if (order.seller.toString() !== req.user._id.toString()) {
            return res
              .status(403)
              .json({ success: false, msg: 'This order is not yours!' });
          } else {
            order.status = config.productStatus.delivered;
            order.save().then(() =>
              res.status(200).json({
                success: true,
                msg: 'Order confirmed successfully!',
              })
            );
          }
        }
      } else if (order.status === config.productStatus.delivered) {
        return res.status(403).json({
          success: false,
          msg: 'This order has been delivered!',
        });
      } else {
        return res
          .status(403)
          .json({ success: false, msg: 'This order has been canceled!' });
      }
    })
    .catch((err) => next(err));
};
