const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(passportLocalMongoose);

const Users = mongoose.model('Users', userSchema);
module.exports = Users;
