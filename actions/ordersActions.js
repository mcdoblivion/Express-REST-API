const { OrderItems, Orders } = require('../models');
const Bluebird = require('bluebird')

const getOrderById = async (orderId) => {
    const order = Orders.findById(orderId)
    return order
}

const getOrderByStatus = async (status, customerId, isSellOrder) => {
    let query = {}
    isSellOrder === 'true' ? (query = { seller: customerId }) : (query = { customer: customerId })
    status && (query.status = status)

    const orders = await Orders.find(query)
        .populate('seller', '-__v -admin')
        .populate('customer', '-__v -admin')
        .sort({ _id: -1 })
        .lean()
    return await Bluebird.map(orders, async (order) => {
        const orderItems = await OrderItems.find({ order: order._id }).populate('product').lean()
        return { ...order, orderItems }
    })
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
    const order = await Orders.create(newOrder)
    return order
}

const updateOrder = async (orderId, updatedOrder) => {
    await Orders.updateOne({ _id: orderId }, { $set: updatedOrder })
}

const createOrderItem = async (newItem) => {
    const item = await OrderItems.create(newItem)
    return item
}

module.exports = {
    getOrderById,
    getOrderByStatus,
    getItemsByOrderId,
    getOrderItemsByProductId,
    getOrderItemsByProductId,
    createOrder,
    updateOrder,
    createOrderItem,
}
