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
  },
  { timestamps: true }
);

const Products = mongoose.model('Products', productSchema);

module.exports = Products;
