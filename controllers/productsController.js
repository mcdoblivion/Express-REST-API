const { productsActions } = require('../actions');

module.exports.getProducts = async (req, res, next) => {
  try {
    const products = await productsActions.getProducts(req.query.search);
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.createProduct = async (req, res, next) => {
  try {
    const product = await productsActions.createProduct({
      ...req.body,
      seller: req.user._id,
    });

    return res.status(201).json({
      success: true,
      msg: 'Created product successfully!',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteProducts = async (req, res, next) => {
  try {
    const deletedCount = await productsActions.deleteProducts(
      req.user._id,
      req.body
    );
    return res.status(200).json({
      success: true,
      msg: `Deleted ${deletedCount} products successfully!`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getOwnProducts = async (req, res, next) => {
  try {
    const products = await productsActions.getProductsBySellerId(req.user._id);
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getProductById = async (req, res, next) => {
  try {
    const product = await productsActions.getProductById(req.params.productId);
    if (!product) {
      const err = new Error(
        'The product with id ' + req.params.productId + ' is not exist!'
      );
      err.status = 404;
      next(err);
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

module.exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productsActions.getProductById(req.params.productId);

    if (!product) {
      const err = new Error(
        'The product with id ' + req.params.productId + ' is not exist!'
      );
      err.status = 404;
      next(err);
    }

    if (product.seller._id.toString() !== req.user._id.toString()) {
      const err = new Error('This product is not yours!');
      err.status = 403;
      next(err);
    }

    await productsActions.updateProduct(req.params.productId, {
      ...req.body,
    });

    return res
      .status(200)
      .json({ success: true, msg: 'Updated product successfully!' });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await productsActions.getProductById(req.params.productId);

    if (!product) {
      const err = new Error(
        'The product with id ' + req.params.productId + ' is not exist!'
      );
      err.status = 404;
      next(err);
    }

    if (product.seller._id.toString() !== req.user._id.toString()) {
      const err = new Error('This product is not yours!');
      err.status = 403;
      next(err);
    }

    await productsActions.deleteProductById(product._id);

    return res
      .status(200)
      .json({ success: true, msg: 'Deleted product successfully!' });
  } catch (error) {
    next(error);
  }
};
