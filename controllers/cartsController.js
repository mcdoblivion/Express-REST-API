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
  CartItems.deleteMany({ user: req.user._id })
    .then((response) => {
      return res.status(200).json({
        success: true,
        msg: `Deleted ${response.deletedCount} products from cart!`,
      });
    })
    .catch((err) => next(err));
};

module.exports.deleteProductFromCart = (req, res, next) => {
  CartItems.findOne({ user: req.user._id, product: req.params.productId }).then(
    (cartItem) => {
      if (!cartItem) {
        return res
          .status(404)
          .json({ success: false, msg: 'Product is not in cart!' });
      }

      return cartItem.remove();
    }
  );
  then(() => {
    return res
      .status(200)
      .json({ success: true, msg: 'Deleted product from cart!' });
  }).catch((err) => next(err));
};

module.exports.updateProductQuantity = (req, res, next) => {
  CartItems.findOne({ user: req.user._id, product: req.params.productId })
    .then((cartItem) => {
      if (!cartItem) {
        return res
          .status(404)
          .json({ success: false, msg: 'Product is not in cart!' });
      }
      return CartItems.findByIdAndUpdate(cartItem._id, {
        $set: { ...req.body },
      });
    })
    .then(() => {
      return res
        .status(200)
        .json({ success: true, msg: 'Updated cart successfully!' });
    })
    .catch((err) => next(err));
};
