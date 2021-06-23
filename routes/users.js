var express = require('express');
var router = express.Router();
const passport = require('passport');
const Users = require('../models/users');
const authenticate = require('../authenticate');
const { isValidObjectId } = require('mongoose');

// GET user(s), need Admin permission, accept query _id
router.get(
  '/',
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    if (!isValidObjectId(req.query._id))
      return res.status(400).json({ success: false, msg: 'Id invalid!' });

    Users.find(req.query)
      .then(
        (users) => {
          return res.status(200).json({ success: true, data: users });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

// GET/DELETE specific user with id, need Admin permission
router.delete(
  '/:userId',
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    if (!isValidObjectId(req.params.userId))
      return res.status(400).json({ success: false, msg: 'Id invalid!' });

    Users.findByIdAndDelete(req.params.userId)
      .then(
        (response) => {
          res.status(200).json(response);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

// Register user
router.post('/signup', (req, res, next) => {
  Users.register(new Users({ ...req.body }), req.body.password, (err, user) => {
    if (err) return res.status(500).json({ err: err });

    user.save().then(
      () => {
        passport.authenticate('local')(req, res, () => {
          res
            .status(200)
            .json({ success: true, msg: 'Registration successfully!' });
        });
      },
      (err) => next(err)
    );
  });
});

// Login and return JWT token
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

// Change password
router.post('/change-password', authenticate.verifyUser, (req, res, next) => {
  Users.changePassword(req.body.oldPassword, req.body.newPassword)
    .then(
      (user) => {
        console.log(user);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

// Check JWT
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
