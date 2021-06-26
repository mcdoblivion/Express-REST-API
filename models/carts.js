const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productsSchema = new Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Products',
  },
  quantity: {
    type: Number,
    min: 1,
  },
});

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'Users',
    },
    products: [productsSchema],
  },
  { timestamps: true }
);

const Carts = mongoose.model('Carts', cartSchema);
module.exports = Carts;
