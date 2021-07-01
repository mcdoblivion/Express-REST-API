const express = require('express');
const productsRouter = express.Router();
const productsController = require('../controllers/productsController');
const commentsController = require('../controllers/commentsController');
const authenticate = require('../authenticate');
const productValidator = require('../middlewares/productValidator');
const commentValidator = require('../middlewares/commentValidator');

// GET /products/
productsRouter.get('/', productsController.getProducts);

// GET /products/:productId
productsRouter.get('/:productId', productsController.getProductById);

// GET /products/comments
productsRouter.get('/comments', commentsController.getAllCommentsAllProducts);

// /products/:productId/comments
productsRouter.get(
  '/:productId/comments',
  commentsController.getAllCommentsOneProduct
);

// All operation after that need authorization
productsRouter.use(authenticate.verifyUser);

// GET /products/own-products
productsRouter.get('/own-products', productsController.getOwnProducts);

// /products/
productsRouter
  .route('/')
  .post(
    productValidator.validateCreateProduct,
    productsController.createProduct
  )
  .delete(productsController.deleteAllProducts);

// /products/:productId
productsRouter
  .route('/:productId')
  .put(productValidator.validateUpdateProduct, productsController.updateProduct)
  .delete(productsController.deleteProduct);

// /products/:productId/comments
productsRouter
  .route('/:productId/comments')
  .post(
    commentValidator.validateCreateComment,
    commentsController.createComment
  );

// /products/:productId/comments/:commentId
productsRouter
  .route('/:productId/comments/:commentId')
  .put(commentValidator.validateUpdateComment, commentsController.updateComment)
  .delete(commentsController.deleteComment);

module.exports = productsRouter;
