const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemsSchema = new Schema(
  {
    order: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Orders',
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Products',
    },
    quantity: {
      type: Number,
      min: 1,
    },
  },
  { timestamps: true }
);

const OrderItems = mongoose.model('OrderItems', orderItemsSchema);
module.exports = OrderItems;
