const Comments = require('../models/comments');
const Products = require('../models/products');
const Orders = require('../models/orders');

module.exports.getAllComments = (req, res, next) => {
  Comments.find({ product: req.params.productId })
    .populate('author', '-_id -__v -phoneNumber -admin -address')
    .then((comments) => {
      res.status(200).json({ success: true, data: comments });
    })
    .catch((err) => next(err));
};

module.exports.createComment = (req, res, next) => {
  Products.findById(req.params.productId)
    .then((product) => {
      if (!product)
        return res.status(404).json({
          success: false,
          msg: 'The product with id ' + req.params.productId + ' is not exist!',
        });

      return Comments.findOne({
        author: req.user._id,
        product: req.params.productId,
      });
    })
    .then((comment) => {
      if (comment) {
        return res
          .status(400)
          .json({ success: false, msg: 'You can only comment once!' });
      }

      return Orders.find({ status: 1 });
    })
    .then((orders) => {
      if (!orders) {
        return res.status(400).json({
          success: false,
          msg: 'You can only comment after buy this product!',
        });
      }

      const userOrders = orders.filter(
        (order) => order.customer.user.toString() === req.user._id.toString()
      );

      const isBought = userOrders.some((order) =>
        order.products.some(
          (product) => product.product.toString() === req.params.productId
        )
      );

      if (!isBought) {
        return res.status(400).json({
          success: false,
          msg: 'You can only comment after buy this product!',
        });
      }

      return Comments.create({
        ...req.body,
        author: req.user._id,
        product: req.params.productId,
      });
    })
    .then(() => {
      return res
        .status(201)
        .json({ success: true, msg: 'Created comment successfully!' });
    })
    .catch((err) => next(err));
};

module.exports.updateComment = (req, res, next) => {
  Products.findById(req.params.productId)
    .then((product) => {
      if (!product)
        return res.status(404).json({
          success: false,
          msg: 'The product with id ' + req.params.productId + ' is not exist!',
        });

      return Comments.findById(req.params.commentId);
    })
    .then((comment) => {
      if (!comment) {
        return res
          .status(404)
          .json({ success: false, msg: 'Comment not found!' });
      }

      if (comment.product.toString() !== req.params.productId.toString()) {
        return res
          .status(400)
          .json({ success: false, msg: 'Comment and product not match!' });
      }

      if (comment.author !== req.user._id) {
        return res
          .status(403)
          .json({ success: false, msg: 'This comment is not yours!' });
      }

      if (req.body.comment) comment.comment = req.body.comment;
      if (req.body.rating) comment.rating = req.body.rating;

      return comment.save();
    })
    .then(() => {
      return res
        .status(200)
        .json({ success: true, msg: 'Updated comment successfully!' });
    })
    .catch((err) => next(err));
};

module.exports.deleteComment = (req, res, next) => {
  Products.findById(req.params.productId)
    .then((product) => {
      if (!product)
        return res.status(404).json({
          success: false,
          msg: 'The product with id ' + req.params.productId + ' is not exist!',
        });

      return Comments.findById(req.params.commentId);
    })
    .then((comment) => {
      if (!comment) {
        return res
          .status(404)
          .json({ success: false, msg: 'Comment not found!' });
      }

      if (comment.product.toString() !== req.params.productId.toString()) {
        return res
          .status(400)
          .json({ success: false, msg: 'Comment and product not match!' });
      }

      if (comment.author !== req.user._id) {
        return res
          .status(403)
          .json({ success: false, msg: 'This comment is not yours!' });
      }

      return Comments.deleteOne({ _id: comment._id });
    })
    .then(() => {
      return res
        .status(200)
        .json({ success: true, msg: 'Deleted comment successfully!' });
    })
    .catch((err) => next(err));
};
