const Joi = require('joi');

const newCommentSchema = Joi.object({
  comment: Joi.string().max(500).required(),
  rating: Joi.number().min(1).max(5).required(),
});

const updateCommentSchema = Joi.object({
  comment: Joi.string().min(1).max(500),
  rating: Joi.number().min(1).max(5),
});

module.exports.validateCreateComment = (req, res, next) => {
  const validateResult = newCommentSchema.validate({ ...req.body });
  if (validateResult.error) {
    const err = new Error(validateResult.error);
    err.status = 400;
    next(err);
  }
  next();
};

module.exports.validateUpdateComment = (req, res, next) => {
  const validateResult = updateCommentSchema.validate({ ...req.body });
  if (validateResult.error) {
    const err = new Error(validateResult.error);
    err.status = 400;
    next(err);
  }
  next();
};
