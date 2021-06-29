const express = require('express');
const productsRouter = express.Router();
const productsController = require('../controllers/productsController');
const commentsController = require('../controllers/commentsController');
const authenticate = require('../authenticate');
const productValidator = require('../middlewares/productValidator');
const commentValidator = require('../middlewares/commentValidator');

// GET /products/own-products
productsRouter.get(
  '/own-products',
  authenticate.verifyUser,
  productsController.getOwnProducts
);

// /products/
productsRouter
  .route('/')
  .get(productsController.getProducts)
  .post(
    authenticate.verifyUser,
    productValidator.validateCreateProduct,
    productsController.createProduct
  )
  .delete(authenticate.verifyUser, productsController.deleteAllProducts);

// /products/comments
productsRouter.get('/comments', commentsController.getAllCommentsAllProducts);

// /products/:productId
productsRouter
  .route('/:productId')
  .get(productsController.getProductById)
  .put(
    authenticate.verifyUser,
    productValidator.validateUpdateProduct,
    productsController.updateProduct
  )
  .delete(authenticate.verifyUser, productsController.deleteProduct);

// /products/:productId/comments
productsRouter
  .route('/:productId/comments')
  .get(commentsController.getAllCommentsOneProduct)
  .post(
    authenticate.verifyUser,
    commentValidator.validateCreateComment,
    commentsController.createComment
  );

// /products/:productId/comments/:commentId
productsRouter
  .route('/:productId/comments/:commentId')
  .put(
    authenticate.verifyUser,
    commentValidator.validateUpdateComment,
    commentsController.updateComment
  )
  .delete(authenticate.verifyUser, commentsController.deleteComment);

module.exports = productsRouter;
