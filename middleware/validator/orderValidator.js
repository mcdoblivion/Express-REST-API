const jwt = require('jsonwebtoken');
const Users = require('../../models/users');
const Products = require('../../models/products');
const mongoose = require('mongoose');

module.exports.validateOrder = (req, res, next) => {
  // Check authorized
  if (req.header('Authorization')) {
    let jwt_payload = jwt.decode(req.header('Authorization').slice(7));

    // Check jwt expired
    if (jwt_payload.exp * 1000 <= Date.now()) {
      return res.status(401).json({
        success: false,
        msg: 'You are not authorized to do this operation!',
      });
    }

    Users.findById(jwt_payload._id).then((user) => {
      // Check user
      if (!user) {
        return res.status(401).json({
          success: false,
          msg: 'You are not authorized to do this operation!',
        });
      }

      // Auto load info if user logged in
      req.user = user;
      req.body.customer = {
        user: user._id,
        name: user.firstName + ' ' + user.lastName,
        address: user.address,
        phoneNumber: user.phoneNumber,
      };
    });
  }

  // Reset status
  req.body.status = 0;

  // Check products before create order
  if (!req.body.products || req.body.products.length < 0) {
    res.status(400).json({
      success: false,
      msg: 'products is required!',
    });
  }

  // Check seller
  if (!req.body.seller || !mongoose.isValidObjectId(req.body.seller)) {
    res.status(400).json({
      success: false,
      msg: 'seller is required!',
    });
  }

  // Check if seller has order products
  Products.find({ seller: req.body.seller })
    .then((products) => {
      let productsValid = req.body.products.every((searchProduct) =>
        products.some(
          (product) =>
            product._id.toString() === searchProduct.product.toString()
        )
      );

      // Don't has
      if (!productsValid) {
        return res.status(400).json({
          success: false,
          msg: 'A order should be has only one seller!',
        });
      } else {
        // if has, check quantity
        let productsQuantityValid = req.body.products.every((searchProduct) => {
          return (
            products.find(
              (product) =>
                product._id.toString() === searchProduct.product.toString()
            ).numberInStock > searchProduct.quantity
          );
        });

        // Invalid quantity
        if (!productsQuantityValid) {
          return res.status(400).json({
            success: false,
            msg: 'Order products must less than number in stock!',
          });
        } else {
          // Everything ok
          next();
        }
      }
    })
    .catch((err) => next(err));
};
