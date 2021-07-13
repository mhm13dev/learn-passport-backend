const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dbConnection = require('../db/connection');
const AppError = require('../utils/AppError');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  hash: String,
  password: String,
  confirmPassword: String,
});

userSchema.pre('save', async function (next) {
  // only runs when password is modified or new
  if (!this.isNew && !this.isModified('password')) {
    return next();
  }

  if (!this.password || !this.confirmPassword) {
    return next(
      new AppError('Password and Confirm Password are required!', 'fail', 403)
    );
  }

  if (this.password !== this.confirmPassword) {
    return next(new AppError('Passwords Do Not Match!', 'fail', 403));
  }

  // Hash the Password
  this.hash = await bcrypt.hash(this.password, 12);

  // Delete the password && confirmPassword field
  this.password = undefined;
  this.confirmPassword = undefined;

  next();
});

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.hash);
};

const UserModel = dbConnection.model('User', userSchema);

module.exports = UserModel;
