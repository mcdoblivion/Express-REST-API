const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    customer: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    seller: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    status: {
      type: Number,
      default: 0,
      min: -1,
      max: 1,
    },
  },
  { timestamps: true }
);

const Orders = mongoose.model('Orders', orderSchema);
module.exports = Orders;
