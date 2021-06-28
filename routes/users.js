var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');
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
router.post('/accounts', usersController.createUserAccount);

// Login and return JWT token
router.post('/accounts/create-jwt', usersController.createJwt);

// Change password
router.put('/accounts/change-password', authenticate.verifyUser);

module.exports = router;
