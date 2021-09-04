const { Users } = require('../models');

const getAllUsers = async () => {
    const users = await Users.find({}).sort({ _id: -1 }).lean()
    return users
}

const getUserById = async (userId) => {
    const user = await Users.findById(userId).lean()
    return user
}

const deleteUserById = async (userId) => {
  const user = await Users.findByIdAndDelete(userId);
  return user;
};

const createNewUser = async (user, password) => {
  // hash algorithm pbkdf2
  const newUser = await Users.register(new Users(user), password);
  await newUser.save();
  return newUser;
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await this.getUserById(userId);
  await user.changePassword(oldPassword, newPassword);
};

const updateInfo = async (userId, newInfo) => {
  const { firstName, lastName, phoneNumber, address } = newInfo
  const user = await Users.findByIdAndUpdate(
    userId,
    {
      $set: { firstName, lastName, phoneNumber, address },
    },
    { new: true }
  ).lean()
  return user
}

module.exports = {
  getAllUsers,
  getUserById,
  deleteUserById,
  createNewUser,
  changePassword,
  updateInfo,
}
