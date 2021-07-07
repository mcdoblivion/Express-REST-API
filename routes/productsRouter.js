const express = require('express');
const productsRouter = express.Router();
const controllers = require('../controllers');
const authenticate = require('../middleware/authenticate');
const validator = require('../middleware/validator');

// GET /products[?search=abc]
productsRouter.get('/', controllers.productsController.getProducts);

// GET /products/own-products
productsRouter.get(
  '/own-products',
  authenticate.verifyUser,
  controllers.productsController.getOwnProducts
);

// GET /products/:productId
productsRouter.get(
  '/:productId',
  controllers.productsController.getProductById
);

// GET /products/comments/:commentId
productsRouter.get(
  '/comments/:commentId',
  controllers.commentsController.getCommentById
);

// /products/:productId/comments
productsRouter.get(
  '/:productId/comments',
  controllers.commentsController.getAllCommentsOneProduct
);

// All operation after that need authorization
productsRouter.use(authenticate.verifyUser);

// /products/
productsRouter
  .route('/')
  .post(
    validator.productValidator.validateCreateProduct,
    controllers.productsController.createProduct
  )
  .delete(controllers.productsController.deleteProducts);

// /products/:productId
productsRouter
  .route('/:productId')
  .put(
    validator.productValidator.validateUpdateProduct,
    controllers.productsController.updateProduct
  )
  .delete(controllers.productsController.deleteProduct);

// /products/:productId/comments
productsRouter
  .route('/:productId/comments')
  .post(
    validator.commentValidator.validateCreateComment,
    controllers.commentsController.createComment
  );

// /products/:productId/comments/:commentId
productsRouter
  .route('/:productId/comments/:commentId')
  .put(
    validator.commentValidator.validateUpdateComment,
    controllers.commentsController.updateComment
  )
  .delete(controllers.commentsController.deleteComment);

module.exports = productsRouter;
