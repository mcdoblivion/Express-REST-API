const express = require('express');
const cartsRouter = express.Router();
const controllers = require('../controllers');
const validator = require('../middleware/validator');
const authenticate = require('../middleware/authenticate');

cartsRouter.use(authenticate.verifyUser);

// /carts/
cartsRouter
  .route('/')
  .get(controllers.cartsController.getCart)
  .post(
    validator.cartValidator.validateCreateCart,
    controllers.cartsController.createCart
  )
  .delete(controllers.cartsController.deleteCart);

// /carts/:productId
cartsRouter
  .route('/:productId')
  .delete(controllers.cartsController.deleteProductFromCart)
  .put(
    validator.cartValidator.validateUpdateCart,
    controllers.cartsController.updateProductQuantity
  );

module.exports = cartsRouter;
