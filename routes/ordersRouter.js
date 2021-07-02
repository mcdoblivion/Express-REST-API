const express = require('express');
const ordersRouter = express.Router();
const ordersController = require('../controllers/ordersController');

const authenticate = require('../middleware/authenticate');
const orderValidator = require('../middleware/validator/orderValidator');

ordersRouter.use(authenticate.verifyUser);

// /orders[?status=-1/0/1, sellOrder=true]
ordersRouter
  .route('/')
  .get(ordersController.getOrders)
  .post(orderValidator.validateOrder, ordersController.createOrder);

// /orders/:orderId[?operation=cancel/confirm]
ordersRouter
  .route('/:orderId')
  .get(ordersController.getOrderById)
  .put(ordersController.updateOrderStatus);

module.exports = ordersRouter;
