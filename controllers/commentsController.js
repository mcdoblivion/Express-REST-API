const config = require('../config');
const {
  commentsActions,
  productsActions,
  ordersActions,
} = require('../actions');

module.exports.getAllCommentsOneProduct = async (req, res, next) => {
  try {
    const comments = await commentsActions.getCommentsByProductId(
      req.params.productId
    );
    return res.status(200).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

module.exports.getCommentById = async (req, res, next) => {
  try {
    const foundComment = await commentsActions.getCommentById(
      req.params.commentId
    );
    res.status(200).json({ success: true, data: foundComment });
  } catch (error) {
    next(error);
  }
};

module.exports.createComment = async (req, res, next) => {
  try {
    // Check exist product
    const product = await productsActions.getProductById(req.params.productId);
    if (!product) {
      const err = new Error(
        'The product with id ' + req.params.productId + ' is not exist!'
      );
      err.status = 404;
      return next(err);
    }

    // Check exist comment
    const existComment = await commentsActions.getCommentByProductIdAndUserId(
      req.user._id,
      req.params.productId
    );
    if (existComment) {
      const err = new Error('You can only comment once!');
      err.status = 400;
      return next(err);
    }

    // Check received product
    const orderItems = await ordersActions.getOrderItemsByProductId(
      req.params.productId
    );

    const receivedProduct = orderItems.some(
      (item) =>
        item.order &&
        item.order.customer.toString() === req.user._id.toString() &&
        item.order.status === config.productStatus.delivered
    );

    if (!receivedProduct) {
      const err = new Error(
        'You can only comment after received this product!'
      );
      err.status = 400;
      return next(err);
    }

    // Create new comment
    const newComment = await commentsActions.createComment({
      ...req.body,
      author: req.user._id,
      product: req.params.productId,
    });

    // Update product rating
    const newComments = await commentsActions.getCommentsByProductId(
      req.params.productId
    );
    const newProductRating =
      newComments.reduce((acc, comment) => acc + comment.rating, 0) /
      newComments.length;

    await productsActions.updateProduct(req.params.productId, {
      rating: newProductRating || 5,
    });

    // Send response
    return res.status(201).json({
      success: true,
      msg: 'Created comment successfully!',
      data: newComment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateComment = async (req, res, next) => {
  try {
    // Check exist product
    const product = await productsActions.getProductById(req.params.productId);
    if (!product) {
      const err = new Error(
        'The product with id ' + req.params.productId + ' is not exist!'
      );
      err.status = 404;
      return next(err);
    }

    // Check exist comment
    const existComment = await commentsActions.getCommentById(
      req.params.commentId
    );
    if (!existComment) {
      const err = new Error('Comment not found!');
      err.status = 404;
      return next(err);
    }

    if (existComment.product.toString() !== req.params.productId.toString()) {
      const err = new Error('Comment and product not match!');
      err.status = 400;
      return next(err);
    }

    if (existComment.author._id.toString() !== req.user._id.toString()) {
      const err = new Error('This comment is not yours!');
      err.status = 403;
      return next(err);
    }

    await commentsActions.updateComment(existComment._id, {
      ...req.body,
    });

    // Update product rating
    const newComments = await commentsActions.getCommentsByProductId(
      existComment.product
    );
    const newProductRating =
      newComments.reduce((acc, comment) => acc + comment.rating, 0) /
      newComments.length;

    await productsActions.updateProduct(req.params.productId, {
      rating: newProductRating || 5,
    });

    // Send response
    return res
      .status(200)
      .json({ success: true, msg: 'Updated comment successfully!' });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteComment = async (req, res, next) => {
  try {
    // Check exist product
    const product = await productsActions.getProductById(req.params.productId);
    if (!product) {
      const err = new Error(
        'The product with id ' + req.params.productId + ' is not exist!'
      );
      err.status = 404;
      return next(err);
    }

    // Check exist comment
    const existComment = await commentsActions.getCommentById(
      req.params.commentId
    );
    if (!existComment) {
      const err = new Error('Comment not found!');
      err.status = 404;
      return next(err);
    }

    if (existComment.product.toString() !== req.params.productId.toString()) {
      const err = new Error('Comment and product not match!');
      err.status = 400;
      return next(err);
    }

    if (existComment.author._id.toString() !== req.user._id.toString()) {
      const err = new Error('This comment is not yours!');
      err.status = 403;
      return next(err);
    }

    // Delete comment
    await commentsActions.deleteCommentById(existComment._id);

    // Update product rating
    const newComments = await commentsActions.getCommentsByProductId(
      existComment.product
    );
    const newProductRating =
      newComments.reduce((acc, comment) => acc + comment.rating, 0) /
      newComments.length;

    await productsActions.updateProduct(req.params.productId, {
      rating: newProductRating || 5,
    });

    // Send response
    return res
      .status(200)
      .json({ success: true, msg: 'Deleted comment successfully!' });
  } catch (error) {
    next(error);
  }
};
