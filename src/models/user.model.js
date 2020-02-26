const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const config = require('../config/config');
const { generateRandomBytes, generateTokenHash } = require('../helpers/crypto');
const { passwordReg } = require('../helpers/validation/user.validation');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      minlength: [4, 'Username should be longer'],
      maxlength: [30, 'Username should be shorter'],
      required: [true, 'Username is required'],
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
        message: '{VALUE} is not a valid email',
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: [8, 'Password should be longer'],
      required: [true, 'Password is required'],
      validate: {
        validator(password) {
          return passwordReg.test(password);
        },
        message: 'Not a valid password',
      },
    },
    firstname: {
      type: String,
      trim: true,
      required: [true, 'First name is required'],
    },
    lastname: {
      type: String,
      trim: true,
      required: [true, 'Last name is required'],
    },
    profilePicture: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
);

UserSchema.plugin(uniqueValidator, {
  message: '{VALUE} already taken',
});

/* eslint-disable func-names */
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await this.hashPassword(this.password);
  }
  if (!this.profilePicture) {
    this.profilePicture = this.generateAvatarUrl();
  }
  return next();
});

UserSchema.methods = {
  async hashPassword(password) {
    // eslint-disable-next-line no-useless-catch
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      return hashed;
    } catch (error) {
      throw error;
    }
  },
  async authenticateUser(password) {
    // eslint-disable-next-line no-useless-catch
    try {
      const match = await bcrypt.compare(password, this.password);
      return match;
    } catch (error) {
      throw error;
    }
  },
  createToken() {
    return jwt.sign({ _id: this._id }, config.jwtSecret, {
      expiresIn: '1d',
    });
  },
  generateAvatarUrl() {
    const hash = crypto
      .createHash('md5')
      .update(this.email)
      .digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?s=240&d=identicon`;
  },
  getEmailVerificationToken() {
    const verificationToken = generateRandomBytes(15);
    this.emailVerificationToken = generateTokenHash(verificationToken);

    return verificationToken;
  },
  getResetPasswordToken() {
    const resetToken = generateRandomBytes(20);
    this.resetPasswordToken = generateTokenHash(resetToken);
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
  },
  toAuthJSON() {
    return {
      _id: this._id,
      username: this.username,
      email: this.email,
      profilePicture: this.profilePicture,
      firstname: this.firstname,
      lastname: this.lastname,
    };
  },
  toProfileJSON() {
    return {
      _id: this._id,
      username: this.username,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      profilePicture: this.profilePicture,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  },
};

const User = mongoose.model('user', UserSchema);

module.exports = User;
