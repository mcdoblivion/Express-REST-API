var express = require('express');
var router = express.Router();
const passport = require('passport');
const Users = require('../models/users');
const authenticate = require('../authenticate');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  Users.register(
    new Users({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) return res.status(500).json({ err: err });

      passport.authenticate('local')(req, res, () => {
        res
          .status(200)
          .json({ success: true, msg: 'Registration successfully!' });
      });
    }
  );
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    console.log(req.user);
    if (!user)
      return res
        .status(401)
        .json({ success: false, msg: 'Login unsuccessful!', err: info });

    req.logIn(user, (err) => {
      if (err)
        return res.status(401).json({
          success: false,
          msg: 'Login unsuccessful!',
          err: 'Could not login!',
        });
    });

    const token = authenticate.getToken({ _id: req.user._id });
    res.status(200).json({
      success: true,
      token: 'bearer ' + token,
      msg: 'Login successfully!',
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.get('/checkJWT', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: 'JWT invalid', err: info });
    }

    return res
      .status(200)
      .json({ success: true, msg: 'JWT valid', user: user });
  })(req, res, next);
});

module.exports = router;
