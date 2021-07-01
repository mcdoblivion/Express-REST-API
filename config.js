module.exports = {
  secretKey: '12345-67890-09876-54321',
  mongoUrl: 'mongodb://localhost:27017/merchize',
  productStatus: {
    orderCanceled: -1,
    waitSellerConfirm: 0,
    delivered: 1,
  },
};
