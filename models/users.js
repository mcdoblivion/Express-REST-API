const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    maxLength: 20,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 20,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    minLength: 10,
    maxLength: 10,
  },
  address: {
    type: String,
    required: true,
    maxLength: 100,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(passportLocalMongoose);

const Users = mongoose.model('Users', userSchema);
module.exports = Users;
