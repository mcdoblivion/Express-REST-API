const Comments = require('../models/comments');
const Products = require('../models/products');
const config = require('../config');
const OrderItems = require('../models/orderItems');

module.exports.getAllCommentsOneProduct = (req, res, next) => {
  Comments.find({ product: req.params.productId })
    .populate('author', '-__v -phoneNumber -admin -address')
    .then((comments) => {
      res.status(200).json({ success: true, data: comments });
    })
    .catch((err) => next(err));
};

module.exports.getCommentById = async (req, res, next) => {
  try {
    const foundComment = await Comments.findById(req.params.commentId);
    res.status(200).json({ success: true, data: foundComment });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllCommentsAllProducts = (req, res, next) => {
  Comments.find({})
    .then((comments) => {
      return res.status(200).json({ success: true, data: comments });
    })
    .catch((error) => next(error));
};

module.exports.createComment = async (req, res, next) => {
  try {
    // Check exist product
    const product = await Products.findById(req.params.productId);
    if (!product) {
      const err = new Error(
        'The product with id ' + req.params.productId + ' is not exist!'
      );
      err.status = 404;
      next(err);
    }

    // Check exist comment
    const existComment = await Comments.findOne({
      author: req.user._id,
      product: req.params.productId,
    });
    if (existComment) {
      const err = new Error('You can only comment once!');
      err.status = 400;
      next(err);
    }

    // Check received product
    const orderItems = await OrderItems.find({
      product: req.params.productId,
    }).populate('order');

    const receivedProduct = orderItems.some(
      (item) =>
        item.order.customer.toString() === req.user._id.toString() &&
        item.order.status === config.productStatus.delivered
    );

    if (!receivedProduct) {
      const err = new Error(
        'You can only comment after received this product!'
      );
      err.status = 400;
      next(err);
    }

    // Create new comment
    const newComment = await Comments.create({
      ...req.body,
      author: req.user._id,
      product: req.params.productId,
    });

    // Update product rating
    const newComments = await Comments.find({ product: req.params.productId });
    const newProductRating =
      newComments.reduce((acc, comment) => acc + comment.rating, 0) /
      newComments.length;

    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.productId,
      {
        $set: { rating: newProductRating },
      }
    );

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
    const product = await Products.findById(req.params.productId);
    if (!product) {
      const err = new Error(
        'The product with id ' + req.params.productId + ' is not exist!'
      );
      err.status = 404;
      next(err);
    }
    // Check exist comment
    const existComment = await Comments.findById(req.params.commentId);
    if (!existComment) {
      const err = new Error('Comment not found!');
      err.status = 404;
      next(err);
    }

    if (existComment.product.toString() !== req.params.productId.toString()) {
      const err = new Error('Comment and product not match!');
      err.status = 400;
      next(err);
    }

    if (existComment.author.toString() !== req.user._id.toString()) {
      const err = new Error('This comment is not yours!');
      err.status = 403;
      next(err);
    }

    if (req.body.comment) existComment.comment = req.body.comment;
    if (req.body.rating) existComment.rating = req.body.rating;

    await existComment.save();

    // Update product rating
    const newComments = await Comments.find({ product: req.params.productId });
    const newProductRating =
      newComments.reduce((acc, comment) => acc + comment.rating, 0) /
      newComments.length;

    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.productId,
      {
        $set: { rating: newProductRating },
      }
    );

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
    const product = await Products.findById(req.params.productId);
    if (!product) {
      const err = new Error(
        'The product with id ' + req.params.productId + ' is not exist!'
      );
      err.status = 404;
      next(err);
    }
    // Check exist comment
    const existComment = await Comments.findById(req.params.commentId);
    if (!existComment) {
      const err = new Error('Comment not found!');
      err.status = 404;
      next(err);
    }

    // Check comment in product
    if (existComment.product.toString() !== req.params.productId.toString()) {
      const err = new Error('Comment and product not match!');
      err.status = 400;
      next(err);
    }

    // Check user have comment
    if (existComment.author.toString() !== req.user._id.toString()) {
      const err = new Error('This comment is not yours!');
      err.status = 403;
      next(err);
    }

    // Delete comment
    await existComment.remove();

    // Update product rating
    const newComments = await Comments.find({ product: req.params.productId });
    const newProductRating =
      newComments.reduce((acc, comment) => acc + comment.rating, 0) /
      newComments.length;

    await Products.findByIdAndUpdate(req.params.productId, {
      $set: { rating: newProductRating },
    });

    // Send response
    return res
      .status(200)
      .json({ success: true, msg: 'Deleted comment successfully!' });
  } catch (error) {
    next(error);
  }
};
