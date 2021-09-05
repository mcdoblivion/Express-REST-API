const { cartsActions } = require('../actions');

module.exports.getCart = async (req, res, next) => {
  try {
    const cartItems = await cartsActions.getCartItemsByUserId(req.user._id);
    return res.status(200).json({ success: true, data: cartItems });
  } catch (error) {
    next(error);
  }
};

module.exports.createCart = async (req, res, next) => {
  try {
    // Update quantity if item already exist
    const cartItem = await cartsActions.getCartItemByUserIdAndProductId(
      req.user._id,
      req.body.product
    );

    if (cartItem) {
      const updatedCartItem = await cartsActions.updateCartItem(cartItem._id, {
        quantity: cartItem.quantity + req.body.quantity,
      });

      return res.status(201).json({
        success: true,
        msg: 'Add to cart successfully!',
        data: updatedCartItem,
      });
    }

    // Or create new cart item
    const newCartItem = await cartsActions.createCartItem({
      ...req.body,
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      msg: 'Add to cart successfully!',
      data: newCartItem,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteCart = async (req, res, next) => {
  try {
    if (req.body) {
      let deletedCount = 0;
      for (const item of req.body) {
        const deletedItem =
          await cartsActions.deleteCartItemByUserIdAndProductId(
            req.user._id,
            item
          );
        if (deletedItem) deletedCount++;
      }

      return res.status(200).json({
        success: true,
        msg: `Deleted ${deletedCount} products from cart!`,
      });
    } else {
      const deletedCount = cartsActions.deleteAllCartItems(req.user._id);
      return res.status(200).json({
        success: true,
        msg: `Deleted ${deletedCount} products from cart!`,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.deleteProductFromCart = async (req, res, next) => {
  try {
    const deletedItem = await cartsActions.deleteCartItemByUserIdAndProductId(
      req.user._id,
      req.params.productId
    );
    if (!deletedItem) {
      const err = new Error('Product is not in cart!');
      err.status = 404;
      return next(err);
    }

    return res
      .status(200)
      .json({ success: true, msg: 'Deleted 1 product from cart!' });
  } catch (error) {
    next(error);
  }
};

module.exports.updateProductQuantity = async (req, res, next) => {
  try {
    const cartItem = await cartsActions.updateCartItem(req.params.productId, {
        quantity: req.body.quantity,
    })
    return res
        .status(200)
        .json({ success: true, msg: 'Updated cart successfully!', data: { cartItem } })
  } catch (error) {
    next(error);
  }
};
