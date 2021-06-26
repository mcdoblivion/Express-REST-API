const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

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
    },
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    seller: {
      type: mongoose.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Currency,
      min: 0,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 1,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Products = mongoose.model('Products', productSchema);

module.exports = Products;
