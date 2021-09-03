const { OrderItems, Orders } = require('../models');

const getOrderById = async (orderId) => {
  const order = Orders.findById(orderId);
  return order;
};

const getBuyOrderByStatus = async (status, customerId) => {
    if (status) {
        const orders = await Orders.find({
            status: status,
            customer: customerId,
        })
            .populate('seller', '-__v -admin')
            .populate('customer', '-__v -admin')
            .sort({ _id: -1 })
            .lean()
        return orders
    } else {
        const orders = await Orders.find({ customer: customerId })
            .populate('seller', '-__v -admin')
            .populate('customer', '-__v -admin')
            .sort({ _id: -1 })
            .lean()
        return orders
    }
}

const getSellOrderByStatus = async (status, customerId) => {
    if (status) {
        const orders = await Orders.find({
            status: status,
            seller: customerId,
        })
            .populate('seller', '-__v -admin')
            .populate('customer', '-__v -admin')
            .sort({ _id: -1 })
            .lean()
        return orders
    } else {
        const orders = await Orders.find({ seller: customerId })
            .populate('seller', '-__v -admin')
            .populate('customer', '-__v -admin')
            .sort({ _id: -1 })
            .lean()
        return orders
    }
}

const getItemsByOrderId = async (orderId) => {
    const items = await OrderItems.find({ order: orderId })
        .populate('product')
        .sort({ _id: -1 })
        .lean()
    return items
}

const getOrderItemsByProductId = async (productId) => {
    const orderItems = await OrderItems.find({
        product: productId,
    })
        .populate('order')
        .sort({ _id: -1 })
        .lean()

    return orderItems
}

const createOrder = async (newOrder) => {
  const order = await Orders.create(newOrder);
  return order;
};

const updateOrder = async (orderId, updatedOrder) => {
  await Orders.updateOne({ _id: orderId }, { $set: updatedOrder });
};

const createOrderItem = async (newItem) => {
  const item = await OrderItems.create(newItem);
  return item;
};

module.exports = {
  getOrderById,
  getBuyOrderByStatus,
  getSellOrderByStatus,
  getItemsByOrderId,
  getOrderItemsByProductId,
  getOrderItemsByProductId,
  createOrder,
  updateOrder,
  createOrderItem,
};
