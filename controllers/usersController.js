const Users = require('../models/users');
const passport = require('passport');
const authenticate = require('../middleware/authenticate');

module.exports.getJwtInfo = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      const err = new Error(info);
      err.status = 401;
      next(err);
    }

    return res
      .status(200)
      .json({ success: true, msg: 'JWT valid', user: user });
  })(req, res, next);
};

module.exports.getAllUsers = (req, res, next) => {
  Users.find()
    .then((users) => {
      return res.status(200).json({ success: true, data: users });
    })
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  Users.findById(req.params.userId)
    .then((user) => {
      return res.status(200).json({ success: true, data: user });
    })
    .catch((err) => next(err));
};

module.exports.deleteUser = (req, res, next) => {
  Users.findByIdAndDelete(req.params.userId)
    .then((user) => {
      if (!user) {
        const err = new Error('User not found!');
        err.status = 404;
        next(err);
      }
      res
        .status(200)
        .json({ success: true, msg: 'Deleted user successfully!' });
    })
    .catch((err) => next(err));
};

module.exports.createUserAccount = (req, res, next) => {
  Users.register(new Users({ ...req.body }), req.body.password, (err, user) => {
    if (err) next(err);

    user
      .save()
      .then(() => {
        passport.authenticate('local')(req, res, () => {
          res
            .status(200)
            .json({ success: true, msg: 'Registration successfully!' });
        });
      })
      .catch((err) => next(err));
  });
};

module.exports.createJwt = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    console.log(req.user);
    if (!user) {
      const err = new Error(info);
      err.status = 401;
      next(err);
    }

    req.logIn(user, (err) => {
      if (err) {
        next(err);
      }
    });

    const token = authenticate.getToken({ _id: req.user._id });
    res.status(200).json({
      success: true,
      token: 'bearer ' + token,
      msg: 'Login successfully!',
    });
  })(req, res, next);
};

module.exports.changePassword = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      return user.changePassword(req.body.oldPassword, req.body.newPassword);
    })
    .then(() => {
      return res
        .status(200)
        .json({ success: true, msg: 'Changed password successfully!' });
    })
    .catch((err) => next(err));
};
