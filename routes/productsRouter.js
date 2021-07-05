const express = require('express');
const productsRouter = express.Router();
const productsController = require('../controllers/productsController');
const commentsController = require('../controllers/commentsController');
const authenticate = require('../middleware/authenticate');
const productValidator = require('../middleware/validator/productValidator');
const commentValidator = require('../middleware/validator/commentValidator');

// GET /products[?search=abc]
productsRouter.get('/', productsController.getProducts);

// GET /products/own-products
productsRouter.get(
  '/own-products',
  authenticate.verifyUser,
  productsController.getOwnProducts
);

// GET /products/:productId
productsRouter.get('/:productId', productsController.getProductById);

// GET /products/comments
productsRouter.get('/comments', commentsController.getAllCommentsAllProducts);

// GET /products/comments/:commentId
productsRouter.get('/comments/:commentId', commentsController.getCommentById);

// /products/:productId/comments
productsRouter.get(
  '/:productId/comments',
  commentsController.getAllCommentsOneProduct
);

// All operation after that need authorization
productsRouter.use(authenticate.verifyUser);

// /products/
productsRouter
  .route('/')
  .post(
    productValidator.validateCreateProduct,
    productsController.createProduct
  )
  .delete(productsController.deleteProducts);

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
