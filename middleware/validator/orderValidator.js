const Joi = require('joi');

const orderSchema = Joi.array().items(
  Joi.object({
    seller: Joi.string().required(),
    product: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
  })
);

module.exports.validateOrder = (req, res, next) => {
  const validateResult = orderSchema.validate([...req.body]);
  if (validateResult.error) {
    const err = new Error(validateResult.error);
    err.status = 400;
    next(err);
  }
  next();
};
