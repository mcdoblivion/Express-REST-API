const Orders = require('../models/orders');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const Products = require('../models/products');

exports.validateOrder = (req, res, next) => {
  if (req.header('Authorization')) {
    let jwt_payload = jwt.decode(req.header('Authorization').slice(7));

    if (jwt_payload) {
      if (jwt_payload.exp * 1000 > Date.now()) {
        Users.findById(jwt_payload._id).then(
          (user) => {
            req.user = user;

            if (user) {
              req.body.customer = {
                user: user._id,
                name: user.firstName + ' ' + user.lastName,
                address: user.address,
                phoneNumber: user.phoneNumber,
              };

              req.body.status = 0;

              if (!req.body.products || req.body.products.length < 0) {
                res.status(400).json({
                  success: false,
                  msg: 'products is required!',
                });
              }

              if (!req.body.seller) {
                res.status(400).json({
                  success: false,
                  msg: 'seller is required!',
                });
              }

              Products.find({ seller: req.body.seller })
                .then(
                  (products) => {
                    let productsValid = req.body.products.every(
                      (searchProduct) =>
                        products.some(
                          (product) =>
                            product._id.toString() ===
                            searchProduct.product.toString()
                        )
                    );

                    if (!productsValid) {
                      return res.status(400).json({
                        success: false,
                        msg: 'A order should be has only one seller!',
                      });
                    } else {
                      let productsQuantityValid = req.body.products.every(
                        (searchProduct) => {
                          return (
                            products.find(
                              (product) =>
                                product._id.toString() ===
                                searchProduct.product.toString()
                            ).numberInStock > searchProduct.quantity
                          );
                        }
                      );

                      if (!productsQuantityValid) {
                        return res.status(400).json({
                          success: false,
                          msg: 'Order products must less than number in stock!',
                        });
                      } else {
                        next();
                      }
                    }
                  },
                  (err) => next(err)
                )
                .catch((err) => next(err));
            }
          },
          (err) => next(err)
        );
      } else {
        return res.status(401).json({
          success: false,
          msg: 'You are not authorized to do this operation!',
        });
      }
    }
  } else {
    req.body.status = 0;

    if (!req.body.products || req.body.products.length < 0) {
      res.status(400).json({
        success: false,
        msg: 'products is required!',
      });
    }

    Products.find({ seller: req.body.seller })
      .then(
        (products) => {
          let productsValid = req.body.products.every((searchProduct) =>
            products.some(
              (product) =>
                product._id.toString() === searchProduct.product.toString()
            )
          );

          if (!productsValid) {
            return res.status(400).json({
              success: false,
              msg: 'A order should be has only one seller!',
            });
          } else {
            let productsQuantityValid = req.body.products.every(
              (searchProduct) => {
                return (
                  products.find(
                    (product) =>
                      product._id.toString() ===
                      searchProduct.product.toString()
                  ).numberInStock > searchProduct.quantity
                );
              }
            );

            if (!productsQuantityValid) {
              return res.status(400).json({
                success: false,
                msg: 'Order products must less than number in stock!',
              });
            } else {
              next();
            }
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
};
