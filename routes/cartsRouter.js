const express = require('express');
const cartsRouter = express.Router();
const cartsController = require('../controllers/cartsController');
const authenticate = require('../authenticate');

cartsRouter.use(authenticate.verifyUser);

// /carts/
cartsRouter
  .route('/')
  .get(cartsController.getCart)
  .post(cartsController.createCart)
  .delete(cartsController.deleteCart);

// /carts/:productId
cartsRouter
  .route('/:productId')
  .delete(cartsController.deleteProductFromCart)
  .put(cartsController.updateProductQuantity);

module.exports = cartsRouter;
