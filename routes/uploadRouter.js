const express = require('express');
const multer = require('multer');
const authenticate = require('../authenticate');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/images');
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + '-' + file.originalname);
  },
});

const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('You can upload only image files!'), false);
  }
  callback(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

const uploadRouter = express.Router();

uploadRouter.post(
  '/',
  authenticate.verifyUser,
  upload.single('imageFile'),
  (req, res, next) => {
    res.status(201).json({
      success: true,
      msg: 'Upload image successfully to: ' + req.file.path,
      path: '/images/' + req.file.filename,
    });
  }
);

module.exports = uploadRouter;