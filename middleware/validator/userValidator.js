const Joi = require('joi');

const userSignupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
  firstName: Joi.string().max(20).required(),
  lastName: Joi.string().max(20).required(),
  phoneNumber: Joi.string()
    .pattern(new RegExp('^(03|05|07|08|09)+([0-9]{8})$'))
    .required(),
  address: Joi.string().max(100).required(),
});

const userLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
    .required(),
});

module.exports.validateCreateAccount = (req, res, next) => {
  const validateResult = userSignupSchema.validate({ ...req.body });
  if (validateResult.error) {
    const err = new Error(validateResult.error);
    err.status = 400;
    next(err);
  }
  next();
};

module.exports.validateCreateToken = (req, res, next) => {
  const validateResult = userLoginSchema.validate({ ...req.body });
  if (validateResult.error) {
    const err = new Error(validateResult.error);
    err.status = 400;
    next(err);
  }
  next();
};

module.exports.validateChangePassword = (req, res, next) => {
  const validateResult = changePasswordSchema.validate({ ...req.body });
  if (validateResult.error) {
    const err = new Error(validateResult.error);
    err.status = 400;
    next(err);
  }
  next();
};
