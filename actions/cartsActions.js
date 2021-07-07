const { CartItems } = require('../models');

const getCartItemsByUserId = async (userId) => {
  const items = await CartItems.find({ user: userId }).populate('product');
  return items;
};

const getCartItemByUserIdAndProductId = async (userId, productId) => {
  const cartItem = CartItems.findOne({
    user: userId,
    product: productId,
  });
  return cartItem;
};

const createCartItem = async (newCartItem) => {
  const cartItem = await CartItems.create(newCartItem);
  return cartItem;
};

const updateCartItem = async (itemId, newCartItem) => {
  await CartItems.updateOne({ _id: itemId }, { $set: newCartItem });
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
