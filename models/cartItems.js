const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemsSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Products',
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
    },
  },
  { timestamps: true }
);

const CartItems = mongoose.model('CartItems', cartItemsSchema);
module.exports = CartItems;
