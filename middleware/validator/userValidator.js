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

const userUpdateSchema = Joi.object({
  firstName: Joi.string().max(20),
  lastName: Joi.string().max(20),
  phoneNumber: Joi.string().pattern(new RegExp('^(03|05|07|08|09)+([0-9]{8})$')),
  address: Joi.string().max(100),
})

const userLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
})

exports.validateCreateAccount = (req, res, next) => {
  _validate(req, res, next, userSignupSchema)
}

exports.validateCreateToken = (req, res, next) => {
  _validate(req, res, next, userLoginSchema)
}

exports.validateChangePassword = (req, res, next) => {
  _validate(req, res, next, changePasswordSchema)
}

exports.validateUpdateInfo = (req, res, next) => {
  _validate(req, res, next, userUpdateSchema)
}

const _validate = (req, res, next, schema) => {
  const validateResult = schema.validate({ ...req.body })
  if (validateResult.error) {
    const err = new Error(validateResult.error)
    err.status = 400
    next(err)
  }
  next()
}
