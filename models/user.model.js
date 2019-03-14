const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const { passwordReg } = require('../helpers/user.validation');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    minlength: [4, 'Username should be longer'],
    required: [true, 'Username is required']
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Email is required'],
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    trim: true,
    minlength: [6, 'Password should be longer'],
    required: [true, 'Username is required'],
    validate: {
      validator(password) {
        return passwordReg.test(password);
      },
      message: '{VALUE} is not a valid password'
    }
  },
  firstName: {
    type: String,
    trim: true,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last name is required']
  }
}, {
  timestamps: true
});

UserSchema.plugin(uniqueValidator, {
  message: '{VALUE} already taken'
});

/* eslint-disable func-names */
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await this.hashPassword(this.password);
  }

  return next();
});

UserSchema.methods = {
  async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      return hashed;
    } catch (error) {
      throw error;
    }
  },
  async authenticateUser(password) {
    try {
      const match = await bcrypt.compare(password, this.password);
      return match;
    } catch (error) {
      throw error;
    }
  },
  toJSON() {
    return {
      _id: this._id,
      username: this.username,
      email: this.email
    };
  }
};

const User = mongoose.model('user', UserSchema);

module.exports = User;
