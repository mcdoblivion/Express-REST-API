const Comments = require('../models/comments');
const Products = require('../models/products');
const CartItems = require('../models/cartItems');
const config = require('../config');

module.exports.getAllCommentsOneProduct = (req, res, next) => {
  Comments.find({ product: req.params.productId })
    .populate('author', '-_id -__v -phoneNumber -admin -address')
    .then((comments) => {
      res.status(200).json({ success: true, data: comments });
    })
    .catch((err) => next(err));
};

module.exports.getAllCommentsAllProducts = (req, res, next) => {
  Comments.find({})
    .then((comments) => {
      return res.status(200).json({ success: true, data: comments });
    })
    .catch((error) => next(error));
};

module.exports.createComment = (req, res, next) => {
  Products.findById(req.params.productId)
    .then((product) => {
      if (!product) {
        const err = new Error(
          'The product with id ' + req.params.productId + ' is not exist!'
        );
        err.status = 404;
        next(err);
      }
      return Comments.findOne({
        author: req.user._id,
        product: req.params.productId,
      });
    })
    .then((comment) => {
      if (comment) {
        const err = new Error('You can only comment once!');
        err.status = 400;
        next(err);
      }
      return CartItems.findOne({
        user: req.user._id,
        product: req.params.productId,
        status: config.productStatus.delivered,
      });
    })
    .then((item) => {
      if (!item) {
        const err = new Error(
          'You can only comment after received this product!'
        );
        err.status = 400;
        next(err);
      }
      return Comments.create({
        ...req.body,
        author: req.user._id,
        product: req.params.productId,
      });
    })
    .then(() => {
      return Comments.find({ product: req.params.productId });
    })
    .then((comments) => {
      const newProductRating =
        comments.reduce((acc, comment) => acc + comment.rating, 0) /
        comments.length;

      Products.findByIdAndUpdate(req.params.productId, {
        $set: { rating: newProductRating },
      });

      return res
        .status(201)
        .json({ success: true, msg: 'Created comment successfully!' });
    })
    .catch((err) => next(err));
};

module.exports.updateComment = (req, res, next) => {
  Products.findById(req.params.productId)
    .then((product) => {
      if (!product) {
        const err = new Error(
          'The product with id ' + req.params.productId + ' is not exist!'
        );
        err.status = 404;
        next(err);
      }
      return Comments.findById(req.params.commentId);
    })
    .then((comment) => {
      if (!comment) {
        const err = new Error('Comment not found!');
        err.status = 404;
        next(err);
      }

      if (comment.product.toString() !== req.params.productId.toString()) {
        const err = new Error('Comment and product not match!');
        err.status = 400;
        next(err);
      }

      if (comment.author !== req.user._id) {
        const err = new Error('This comment is not yours!');
        err.status = 403;
        next(err);
      }

      if (req.body.comment) comment.comment = req.body.comment;
      if (req.body.rating) comment.rating = req.body.rating;

      return comment.save();
    })
    .then(() => {
      return Comments.find({ product: req.params.productId });
    })
    .then((comments) => {
      const newProductRating =
        comments.reduce((acc, comment) => acc + comment.rating, 0) /
        comments.length;

      Products.findByIdAndUpdate(req.params.productId, {
        $set: { rating: newProductRating },
      });

      return res
        .status(200)
        .json({ success: true, msg: 'Updated comment successfully!' });
    })
    .catch((err) => next(err));
};

module.exports.deleteComment = (req, res, next) => {
  Products.findById(req.params.productId)
    .then((product) => {
      if (!product) {
        const err = new Error(
          'The product with id ' + req.params.productId + ' is not exist!'
        );
        err.status = 404;
        next(err);
      }
      return Comments.findById(req.params.commentId);
    })
    .then((comment) => {
      if (!comment) {
        const err = new Error('Comment not found!');
        err.status = 404;
        next(err);
      }

      if (comment.product.toString() !== req.params.productId.toString()) {
        const err = new Error('Comment and product not match!');
        err.status = 400;
        next(err);
      }

      if (comment.author !== req.user._id) {
        const err = new Error('This comment is not yours!');
        err.status = 403;
        next(err);
      }

      return Comments.deleteOne({ _id: comment._id });
    })
    .then(() => {
      return Comments.find({ product: req.params.productId });
    })
    .then((comments) => {
      const newProductRating =
        comments.reduce((acc, comment) => acc + comment.rating, 0) /
        comments.length;

      Products.findByIdAndUpdate(req.params.productId, {
        $set: { rating: newProductRating },
      });

      return res
        .status(200)
        .json({ success: true, msg: 'Deleted comment successfully!' });
    })
    .catch((err) => next(err));
};
