var express = require('express');
var router = express.Router();
const controllers = require('../controllers');
const validator = require('../middleware/validator');
const authenticate = require('../middleware/authenticate');

// Check JWT
router.get('/jwt-info', controllers.usersController.getJwtInfo);

// Register user
router.post(
  '/account',
  validator.userValidator.validateCreateAccount,
  controllers.usersController.createUserAccount
);

// Login and return JWT token
router.post(
  '/account/create-jwt',
  validator.userValidator.validateCreateToken,
  controllers.usersController.createJwt
);

// All operation after that need authorization
router.use(authenticate.verifyUser);

// Change password
router.put(
  '/account/change-password',
  validator.userValidator.validateChangePassword,
  controllers.usersController.changePassword
);

// All operation after that need authorization as Admin
router.use(authenticate.verifyAdmin);

// GET all users, need Admin permission
router.get('/', controllers.usersController.getAllUsers);

// GET / DELETE specific user with id, need Admin permission
router
  .route('/:userId')
  .get(controllers.usersController.getUserById)
  .delete(controllers.usersController.deleteUser);

module.exports = router;
