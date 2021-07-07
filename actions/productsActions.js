const fs = require('fs');
const { commentsActions } = require('.');
const { Products } = require('../models');

const getProducts = async (search) => {
  const products = await Products.find(
    search ? { $text: { $search: search } } : {}
  ).populate('seller', '-__v -phoneNumber -admin -address');
  return products;
};

const getProductsBySellerId = async (sellerId) => {
  const products = await Products.find({ seller: sellerId });
  return products;
};

const getProductById = async (productId) => {
  const product = await Products.findById(productId).populate(
    'seller',
    '-__v -admin -address'
  );
  return product;
};

const createProduct = async (product) => {
  const newProduct = await Products.create(product);
  return newProduct;
};

const updateProduct = async (productId, updatedProduct) => {
  await Products.updateOne({ _id: productId }, { $set: updatedProduct });
};

const deleteProducts = async (sellerId, productsList) => {
  let deletedCount = 0;
  if (!productsList || productsList.length === 0) {
    const products = await Products.find({ seller: sellerId });
    deletedCount = products.length;
    for (const product of products) {
      await commentsActions.deleteCommentsByProductId(product._id);
      product.images.forEach((image) => {
        fs.unlink(`public/${image}`, (err) => console.log('Error:', err));
      });
      await product.remove();
    }
  } else {
    for (product of productsList) {
      const foundProduct = await Products.findOneAndRemove({
        seller: sellerId,
        _id: product,
      });
      if (foundProduct) {
        await commentsActions.deleteCommentsByProductId(foundProduct._id);
        foundProduct.images.forEach((image) => {
          fs.unlink(`public/${image}`, (err) => console.log('Error:', err));
        });
        deletedCount++;
      }
    }
  }
  return deletedCount;
};

const deleteProductById = async (productId) => {
  const product = await Products.findByIdAndDelete(productId);
  await commentsActions.deleteCommentsByProductId(product._id);
  product.images.forEach((image) => {
    fs.unlink(`public/${image}`, (err) => console.log('Error:', err));
  });
};

module.exports = {
  getProducts,
  getProductsBySellerId,
  getProductById,
  createProduct,
  updateProduct,
  deleteProducts,
  deleteProductById,
};
