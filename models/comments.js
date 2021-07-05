const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Products',
      required: true,
    },
  },
  { timestamps: true }
);

const Comments = mongoose.model('Comments', commentSchema);
module.exports = Comments;
