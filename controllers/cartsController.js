const CartItems = require('../models/cartItems');

module.exports.getCart = (req, res, next) => {
  CartItems.find({ user: req.user._id })
    .populate('product')
    .then((cartItems) => {
      return res.status(200).json({ success: true, data: cartItems });
    })
    .catch((err) => next(err));
};

module.exports.createCart = (req, res, next) => {
  CartItems.findOne({
    user: req.user._id,
    product: req.body.product,
  })
    .then((cartItem) => {
      if (cartItem) {
        cartItem.quantity += req.body.quantity;
        cartItem.save();
        return res.status(201).json({
          success: true,
          msg: 'Add to cart successfully!',
          data: cartItem,
        });
      }
      return CartItems.create({
        ...req.body,
        user: req.user._id,
      });
    })
    .then((cartItem) => {
      return res.status(201).json({
        success: true,
        msg: 'Add to cart successfully!',
        data: cartItem,
      });
    })
    .catch((err) => next(err));
};

module.exports.deleteCart = (req, res, next) => {
  if (req.body) {
    CartItems.find({ user: req.user._id })
      .then((items) => {
        items.forEach((item) => {
          if (req.body.includes(item.product.toString())) {
            item.remove();
          }
        });

        return res.status(200).json({
          success: true,
          msg: 'Deleted products from cart!',
        });
      })
      .catch((err) => next(err));
  } else {
    CartItems.deleteMany({ user: req.user._id })
      .then((response) => {
        return res.status(200).json({
          success: true,
          msg: `Deleted ${response.deletedCount} products from cart!`,
        });
      })
      .catch((err) => next(err));
  }
};

module.exports.deleteProductFromCart = (req, res, next) => {
  CartItems.findOne({ user: req.user._id, product: req.params.productId })
    .then((cartItem) => {
      if (!cartItem) {
        const err = new Error('Product is not in cart!');
        err.status = 404;
        next(err);
      }
      return cartItem.remove();
    })
    .then(() => {
      return res
        .status(200)
        .json({ success: true, msg: 'Deleted product from cart!' });
    })
    .catch((err) => next(err));
};

module.exports.updateProductQuantity = (req, res, next) => {
  CartItems.findOne({ user: req.user._id, product: req.params.productId })
    .then((cartItem) => {
      if (!cartItem) {
        const err = new Error('Product is not in cart!');
        err.status = 404;
        next(err);
      }
      return CartItems.findByIdAndUpdate(cartItem._id, {
        $set: { quantity: req.body.quantity },
      });
    })
    .then(() => {
      return res
        .status(200)
        .json({ success: true, msg: 'Updated cart successfully!' });
    })
    .catch((err) => next(err));
};
