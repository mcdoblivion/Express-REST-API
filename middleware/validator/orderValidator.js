const Joi = require('joi');
const actions = require('../../actions');

const orderSchema = Joi.array().items(
  Joi.object({
    seller: Joi.string().required(),
    product: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
  })
);

module.exports.validateOrder = async (req, res, next) => {
  const validateResult = orderSchema.validate([...req.body]);
  if (validateResult.error) {
    const err = new Error(validateResult.error);
    err.status = 400;
    next(err);
  }

  for (const item of req.body) {
    const product = await actions.productsActions.getProductById(item.product);
    if (product.numberInStock < item.quantity) {
      const err = new Error('Product quantity must less than number in stock!');
      err.status = 400;
      next(err);
    }
  }

  next();
};
