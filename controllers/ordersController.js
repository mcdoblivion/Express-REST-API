const config = require('../config');
const CartItems = require('../models/cartItems');
const OrderItems = require('../models/orderItems');
const Orders = require('../models/orders');
const Products = require('../models/products');

module.exports.getOrders = async (req, res, next) => {
  try {
    let status = {};
    if (req.query.status) status = { status: req.query.status };

    const orders = await Orders.find(status)
      .populate('seller', '-__v -admin')
      .populate('customer', '-__v -admin');

    const ordersFiltered =
      req.query.sellOrder === 'true'
        ? orders.filter(
            (order) => order.seller._id.toString() === req.user._id.toString()
          )
        : orders.filter(
            (order) => order.customer._id.toString() === req.user._id.toString()
          );

    const resultPromise = ordersFiltered.map(async (order) => {
      const orderItems = await OrderItems.find({ order: order._id }).populate(
        'product'
      );
      return { ...order.toObject(), orderItems: orderItems };
    });

    const result = await Promise.all(resultPromise);
    console.log(result);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports.createOrder = async (req, res, next) => {
  try {
    const groupByKey = (list, key) =>
      list.reduce(
        (hash, obj) => ({
          ...hash,
          [obj[key]]: (hash[obj[key]] || []).concat(obj),
        }),
        {}
      );

    const orderItemsGroupBySeller = groupByKey(req.body, 'seller');

    for (const [seller, orderItems] of Object.entries(
      orderItemsGroupBySeller
    )) {
      // Create order
      const order = await Orders.create({
        seller: seller,
        customer: req.user._id,
        status: config.productStatus.waitSellerConfirm,
      });

      for (const item of orderItems) {
        // Update products stock
        const product = await Products.findById(item.product);
        product.numberInStock -= item.quantity;
        product.save();

        // Update cart
        const cartItem = await CartItems.findOne({
          user: req.user._id,
          product: item.product,
        });
        if (cartItem) cartItem.remove();

        // Add item to order
        await OrderItems.create({ ...item, order: order._id });
      }
    }

    return res.status(201).json({
      success: true,
      msg: 'Order is successful, wait for seller to confirm',
    });
  } catch (error) {
    next(error);
  }
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

module.exports.updateOrderStatus = async (req, res, next) => {
  if (req.query.operation !== 'cancel' && req.query.operation !== 'confirm') {
    const err = new Error('Operation must be cancel/confirm!');
    err.status = 400;
    next(err);
  }
  try {
    const order = await Orders.findById(req.params.orderId);
    if (
      order.customer.toString() !== req.user._id.toString() &&
      order.seller.toString() !== req.user._id.toString()
    ) {
      const err = new Error('This order is not yours!');
      err.status = 403;
      next(err);
    }

    if (order.status === config.productStatus.waitSellerConfirm) {
      if (req.query.operation === 'cancel') {
        const orderItems = await OrderItems.find({ order: order._id });
        for (const item of orderItems) {
          const product = await Products.findById(item.product);
          product.quantity += item.quantity;
          await product.save();
        }
        order.status = config.productStatus.orderCanceled;
        await order.save();
        return res.status(200).json({
          success: true,
          msg: 'Order canceled successfully!',
        });
      } else {
        if (order.seller.toString() !== req.user._id.toString()) {
          const err = new Error('This order is not yours!');
          err.status = 403;
          next(err);
        } else {
          order.status = config.productStatus.delivered;
          await order.save();
          return res.status(200).json({
            success: true,
            msg: 'Order confirmed successfully!',
          });
        }
      }
    } else if (order.status === config.productStatus.delivered) {
      const err = new Error('This order has been delivered!');
      err.status = 403;
      next(err);
    } else {
      const err = new Error('This order has been canceled!');
      err.status = 403;
      next(err);
    }
  } catch (error) {
    next(error);
  }
};
