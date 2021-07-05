const express = require('express');
const ordersRouter = express.Router();
const controllers = require('../controllers');
const authenticate = require('../middleware/authenticate');
const validator = require('../middleware/validator');

ordersRouter.use(authenticate.verifyUser);

// GET /orders[?status=-1/0/1, sellOrder=true]
ordersRouter.get('/', controllers.ordersController.getOrders);

// POST /orders
ordersRouter.post(
  '/',
  validator.orderValidator.validateOrder,
  controllers.ordersController.createOrder
);

// GET /orders/:orderId
ordersRouter.get('/:orderId', controllers.ordersController.getOrderById);

// PUT /orders/:orderId[?operation=cancel/confirm]
ordersRouter
  .route('/:orderId')
  .put(controllers.ordersController.updateOrderStatus);

module.exports = ordersRouter;
