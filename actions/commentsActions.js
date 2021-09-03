const { Comments } = require('../models');

const getCommentsByProductId = async (productId) => {
  const comments = await Comments.find({ product: productId })
      .populate('author', '-__v -phoneNumber -admin -address')
      .sort({ _id: -1 })
      .lean()
  return comments
};

const getCommentById = async (commentId) => {
  const comment = await Comments.findById(commentId).populate(
    'author',
    '-__v -phoneNumber -admin -address'
  );
  return comment;
};

const getCommentByProductIdAndUserId = async (userId, productId) => {
  const comment = await Comments.findOne({
    author: userId,
    product: productId,
  });
  return comment;
};

const createComment = async (newComment) => {
  await Comments.create(newComment);
};

const updateComment = async (commentId, updatedComment) => {
  await Comments.updateOne({ _id: commentId }, { $set: updatedComment });
};

const deleteCommentById = async (commentId) => {
  await Comments.deleteOne({ _id: commentId });
};

const deleteCommentsByProductId = async (productId) => {
  await Comments.deleteMany({ product: productId })
};

module.exports = {
  getCommentsByProductId,
  getCommentById,
  getCommentByProductIdAndUserId,
  createComment,
  updateComment,
  deleteCommentById,
  deleteCommentsByProductId,
};
