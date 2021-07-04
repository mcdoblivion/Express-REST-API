const express = require('express');
const ordersRouter = express.Router();
const ordersController = require('../controllers/ordersController');

const authenticate = require('../middleware/authenticate');
const orderValidator = require('../middleware/validator/orderValidator');

ordersRouter.use(authenticate.verifyUser);

// GET /orders[?status=-1/0/1, sellOrder=true]
ordersRouter.get('/', ordersController.getOrders);

// POST /orders
ordersRouter.post(
  '/',
  orderValidator.validateOrder,
  ordersController.createOrder
);

// GET /orders/:orderId
ordersRouter.get('/:orderId', ordersController.getOrderById);

// PUT /orders/:orderId[?operation=cancel/confirm]
ordersRouter.route('/:orderId').put(ordersController.updateOrderStatus);

module.exports = ordersRouter;
