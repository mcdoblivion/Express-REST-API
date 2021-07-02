const express = require('express');
const cartsRouter = express.Router();
const cartsController = require('../controllers/cartsController');
const cartValidator = require('../middleware/validator/cartValidator');
const authenticate = require('../middleware/authenticate');

cartsRouter.use(authenticate.verifyUser);

// /carts/
cartsRouter
  .route('/')
  .get(cartsController.getCart)
  .post(cartValidator.validateCreateCart, cartsController.createCart)
  .delete(cartsController.deleteCart);

// /carts/:productId
cartsRouter
  .route('/:productId')
  .delete(cartsController.deleteProductFromCart)
  .put(cartValidator.validateUpdateCart, cartsController.updateProductQuantity);

module.exports = cartsRouter;
