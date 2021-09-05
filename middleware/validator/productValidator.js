const Joi = require('joi');

const newProductSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(5000).required(),
  category: Joi.string().max(20).required(),
  images: Joi.array().items(Joi.string().required()).min(1).required(),
  price: Joi.string().min(1).max(10).required(),
  numberInStock: Joi.number().min(1).max(99999).required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().max(100),
  description: Joi.string().max(5000),
  category: Joi.string().max(20),
  images: Joi.array().items(Joi.string().required()).min(1),
  price: Joi.string().min(1).max(10),
  numberInStock: Joi.number().min(1).max(99999),
});

module.exports.validateCreateProduct = (req, res, next) => {
  const validateResult = newProductSchema.validate({ ...req.body });
  if (validateResult.error) {
    const err = new Error(validateResult.error);
    err.status = 400;
    return next(err);
  }
  next();
};

module.exports.validateUpdateProduct = (req, res, next) => {
  const validateResult = updateProductSchema.validate({ ...req.body });
  if (validateResult.error) {
    const err = new Error(validateResult.error);
    err.status = 400;
    return next(err);
  }
  next();
};
