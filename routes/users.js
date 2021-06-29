var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');
const userValidator = require('../middlewares/userValidator');
const authenticate = require('../authenticate');

// Check JWT
router.get('/jwt-info', usersController.getJwtInfo);

// GET all users, need Admin permission
router.get(
  '/',
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  usersController.getAllUsers
);

// DELETE specific user with id, need Admin permission
router
  .route('/:userId')
  .get(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    usersController.getUserById
  )
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    usersController.deleteUser
  );

// Register user
router.post(
  '/account',
  userValidator.validateCreateAccount,
  usersController.createUserAccount
);

// Login and return JWT token
router.post('/account/create-jwt', usersController.createJwt);

// Change password
router.put('/account/change-password', authenticate.verifyUser);

module.exports = router;
