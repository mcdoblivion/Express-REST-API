const { ordersActions, productsActions, cartsActions } = require('../actions');
const config = require('../config');

module.exports.getOrders = async (req, res, next) => {
  const { status, isSellOrder } = req.query
  const userId = req.user._id
  try {
      const orders = await ordersActions.getOrderByStatus(status, userId, isSellOrder)
      return res.status(200).json({ success: true, data: orders })
  } catch (error) {
      next(error)
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
      const order = await ordersActions.createOrder({
        seller: seller,
        customer: req.user._id,
        status: config.productStatus.waitSellerConfirm,
      });

      for (const item of orderItems) {
        // Update products stock
        const product = await productsActions.getProductById(item.product);
        await productsActions.updateProduct(product._id, {
          numberInStock: product.numberInStock - item.quantity,
        });

        // Update cart
        await cartsActions.deleteCartItemByUserIdAndProductId(
          req.user._id,
          item.product
        );

        // Add item to order
        await ordersActions.createOrderItem({
          ...item,
          order: order._id,
        });
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

module.exports.getOrderById = async (req, res, next) => {
  try {
    const order = await ordersActions.getOrderById(req.params.orderId);
    const orderItems = await ordersActions.getItemsByOrderId(order._id);
    return res.status(200).json({
      success: true,
      data: { ...order, orderItems: orderItems },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateOrderStatus = async (req, res, next) => {
  if (req.query.operation !== 'cancel' && req.query.operation !== 'confirm') {
    const err = new Error('Operation must be cancel/confirm!');
    err.status = 400;
    next(err);
  }
  try {
    const order = await ordersActions.getOrderById(req.params.orderId);
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
        // Update products number in stock
        const orderItems = await ordersActions.getItemsByOrderId(order._id);
        for (const item of orderItems) {
          const product = await productsActions.getProductById(item.product);
          await productsActions.updateProduct(product._id, {
            numberInStock: product.numberInStock + item.quantity,
          });
        }
        // Update order status to canceled
        await ordersActions.updateOrder(order._id, {
          status: config.productStatus.orderCanceled,
        });

        // Send response
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
          // Update order status to delivered
          await ordersActions.updateOrder(order._id, {
            status: config.productStatus.delivered,
          });

          // Send response
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
