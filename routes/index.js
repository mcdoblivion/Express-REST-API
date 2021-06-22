var express = require('express');
var router = express.Router();

/* GET home page. */
router
  .route('/')
  .get((req, res, next) => {
    res.render('index', { title: 'Express' });
  })
  .post((req, res) => {
    res
      .status(403)
      .end('POST operation not supported on ' + req.headers.host + '/');
  })
  .put((req, res) => {
    res
      .status(403)
      .end('PUT operation not supported on ' + req.headers.host + '/');
  })
  .delete((req, res) => {
    res
      .status(403)
      .end('DELETE operation not supported on ' + req.headers.host + '/');
  });

module.exports = router;
