const express = require('express');
const ordersRouter = express.Router();
const ordersController = require('../controllers/ordersController');

const authenticate = require('../authenticate');
const orderValidator = require('../middlewares/orderValidator');

// /orders[?status=-1/0/1, sellOrder=true]
ordersRouter
  .route('/')
  .get(authenticate.verifyUser, ordersController.getOrders)
  .post(orderValidator.validateOrder, ordersController.createOrder);

// /orders/:orderId[?operation=cancel/confirm]
ordersRouter
  .route('/:orderId')
  .get(ordersController.getOrderById)
  .put(authenticate.verifyUser, ordersController.updateOrder);

module.exports = ordersRouter;
