var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');
const userValidator = require('../middleware/validator/userValidator');
const authenticate = require('../middleware/authenticate');

// Check JWT
router.get('/jwt-info', usersController.getJwtInfo);

// Register user
router.post(
  '/account',
  userValidator.validateCreateAccount,
  usersController.createUserAccount
);

// Login and return JWT token
router.post(
  '/account/create-jwt',
  userValidator.validateCreateToken,
  usersController.createJwt
);

// All operation after that need authorization
router.use(authenticate.verifyUser);

// Change password
router.put(
  '/account/change-password',
  userValidator.validateChangePassword,
  usersController.changePassword
);

// All operation after that need authorization as Admin
router.use(authenticate.verifyAdmin);

// GET all users, need Admin permission
router.get('/', usersController.getAllUsers);

// GET / DELETE specific user with id, need Admin permission
router
  .route('/:userId')
  .get(usersController.getUserById)
  .delete(usersController.deleteUser);

module.exports = router;
