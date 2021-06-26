const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productsSchema = new Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Products',
    },
    quantity: {
      type: Number,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    customer: {
      user: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
      },
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
    },
    seller: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    products: [productsSchema],
    status: {
      // -1 => canceled, 0 => wait for seller confirm, 1 => success
      type: Number,
      min: -1,
      max: 1,
      default: 0,
    },
  },
  { timestamps: true }
);

const Orders = mongoose.model('Orders', orderSchema);
module.exports = Orders;
