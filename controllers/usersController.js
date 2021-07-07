const passport = require('passport');
const authenticate = require('../middleware/authenticate');
const { usersActions } = require('../actions');

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

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await usersActions.getAllUsers();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const user = usersActions.getUserById(req.params.userId);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const user = await usersActions.deleteUserById(req.params.userId);
    if (!user) {
      const err = new Error('User not found!');
      err.status = 404;
      next(err);
    }
    res.status(200).json({
      success: true,
      msg: `Deleted user ${user.username} successfully!`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.createUserAccount = async (req, res, next) => {
  try {
    await usersActions.createNewUser({ ...req.body }, req.body.password);

    passport.authenticate('local')(req, res, () => {
      res
        .status(200)
        .json({ success: true, msg: 'Registration successfully!' });
    });
  } catch (error) {
    next(error);
  }
};

module.exports.createJwt = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) next(err);

    console.log(req.user);
    if (!user) {
      const err = new Error(info);
      err.status = 401;
      next(err);
    }

    // Load user info to request
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

module.exports.changePassword = async (req, res, next) => {
  try {
    await usersActions.changePassword(
      req.user._id,
      req.body.oldPassword,
      req.body.newPassword
    );
    return res
      .status(200)
      .json({ success: true, msg: 'Changed password successfully!' });
  } catch (error) {
    next(error);
  }
};
