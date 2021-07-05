const express = require('express');
const multer = require('multer');
const fs = require('fs');
const authenticate = require('../middleware/authenticate');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/images');
  },
  filename: (req, file, callback) => {
    callback(
      null,
      req.user._id.toString() + '-' + Date.now() + '-' + file.originalname
    );
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

uploadRouter.use(authenticate.verifyUser);

// POST /images
uploadRouter.post('/', upload.single('imageFile'), async (req, res, next) => {
  try {
    res.status(201).json({
      success: true,
      msg: 'Upload image successfully to: ' + req.file.path,
      path: '/images/' + req.file.filename,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /images/:imageName
uploadRouter.delete('/:imageName', async (req, res, next) => {
  try {
    const imageName = req.params.imageName;
    if (imageName.startsWith(req.user._id.toString())) {
      fs.unlink(`public/images/${imageName}`, (err) => console.log(err));
      return res
        .status(200)
        .json({ success: true, msg: 'Deleted image successfully!' });
    }
    const err = new Error('This image is not yours!');
    err.status = 403;
    next(err);
  } catch (error) {
    next(error);
  }
});

module.exports = uploadRouter;
