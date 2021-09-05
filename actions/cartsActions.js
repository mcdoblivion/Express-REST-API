const { CartItems } = require('../models');

const getCartItemsByUserId = async (userId) => {
    const items = await CartItems.find({ user: userId })
        .populate('product')
        .sort({ _id: -1 })
        .lean()
    return items
}

const getCartItemByUserIdAndProductId = async (userId, productId) => {
    const cartItem = CartItems.findOne({
        user: userId,
        product: productId,
    }).lean()
    return cartItem
}

const createCartItem = async (newCartItem) => {
    const cartItem = new CartItems(newCartItem)
    return await cartItem.save()
}

const updateCartItem = async (itemId, newCartItem) => {
  return await CartItems.findByIdAndUpdate(
    itemId,
    { $set: newCartItem },
    { new: true }
  );
};

const deleteCartItemByUserIdAndProductId = async (userId, productId) => {
  const item = await CartItems.findOneAndDelete({
    user: userId,
    product: productId,
  });
  return item;
};

const deleteAllCartItems = async (userId) => {
  const result = await CartItems.deleteMany({ user: userId });
  return result.deletedCount;
};

module.exports = {
  getCartItemsByUserId,
  getCartItemByUserIdAndProductId,
  createCartItem,
  updateCartItem,
  deleteCartItemByUserIdAndProductId,
  deleteAllCartItems,
};
