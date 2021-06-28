const Products = require('../models/products');

module.exports.getAllComments = (req, res, next) => {
  Products.findById(req.params.productId)
    .populate('comments.author', '-_id -__v -phoneNumber -admin -address')
    .then((product) => {
      if (!product)
        return res.status(404).json({
          success: false,
          msg: 'The product with id ' + req.params.productId + ' is not exist!',
        });

      res.status(200).json({ success: true, data: product.comments });
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

      req.body.author = req.user._id;
      product.comments.push(req.body);

      product.save().then(
        () =>
          res.status(201).json({
            success: true,
            msg: 'Created comment successfully!',
          }),
        (err) => next(err)
      );
    })
    .catch((err) => next(err));
};

module.exports.getCommentById = (req, res, next) => {
  Products.findById(req.params.productId)
    .populate('comments.author', '-_id -__v -phoneNumber -admin -address')
    .then((product) => {
      if (!product)
        return res.status(404).json({
          success: false,
          msg: 'The product with id ' + req.params.productId + ' is not exist!',
        });

      let comment = product.comments.id(req.params.commentId);
      if (!comment)
        return res.status(404).json({
          success: false,
          msg: 'The comment with id ' + req.params.commentId + ' is not exist!',
        });

      res.status(200).json({
        success: true,
        data: product.comments.id(req.params.commentId),
      });
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

      let comment = product.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).json({
          success: false,
          msg: 'The comment with id ' + req.params.commentId + ' is not exist!',
        });
      }

      if (comment.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          msg: 'Can only edit own comment!',
        });
      }

      if (req.body.rating) comment.rating = req.body.rating;
      if (req.body.comment) comment.comment = req.body.comment;

      product.save().then(
        () => {
          res
            .status(200)
            .json({ success: true, msg: 'Updated comment successfully!' });
        },
        (err) => next(err)
      );
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

      let comment = product.comments.id(req.params.commentId);
      if (!comment)
        return res.status(404).json({
          success: false,
          msg: 'The comment with id ' + req.params.commentId + ' is not exist!',
        });

      if (comment.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          msg: 'Can only delete own comment!',
        });
      }

      product.comments.id(req.params.commentId).remove();
      product.save().then(
        () => {
          res
            .status(200)
            .json({ success: true, msg: 'Deleted comment successfully!' });
        },
        (err) => next(err)
      );
    })
    .catch((err) => next(err));
};
