const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxLength: 100,
    },
    seller: {
      type: mongoose.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 5000,
    },
    rating: {
      type: Number,
      default: 5,
      max: 5,
      min: 1,
    },
    category: {
      type: String,
      required: true,
      maxLength: 20,
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
      max: 9999,
    },
  },
  { timestamps: true }
);

const Products = mongoose.model('Products', productSchema);

module.exports = Products;
