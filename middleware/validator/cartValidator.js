const Joi = require('joi');

const createCartSchema = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
});

const updateCartSchema = Joi.object({
  quantity: Joi.number().min(1).required(),
});

module.exports.validateCreateCart = (req, res, next) => {
  const validateResult = createCartSchema.validate({ ...req.body });
  if (validateResult.error) {
    const err = new Error(validateResult.error);
    err.status = 400;
    next(err);
  }
  next();
};

module.exports.validateUpdateCart = (req, res, next) => {
  const validateResult = updateCartSchema.validate({ ...req.body });
  if (validateResult.error) {
    const err = new Error(validateResult.error);
    err.status = 400;
    next(err);
  }
  next();
};
