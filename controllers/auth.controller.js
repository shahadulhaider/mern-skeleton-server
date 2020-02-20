const HTTPStatus = require('http-status');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const ApiError = require('../helpers/apiError');
const { emailUrls } = require('../helpers/urlHelper');
const sendEmail = require('../helpers/sendEmail');
const { generateTokenHash } = require('../helpers/crypto');

async function registerUser(req, res, next) {
  try {
    const user = await User.create(req.body);

    const verificationToken = user.getEmailVerificationToken();
    const verificationUrl = `${
      emailUrls(req).verification
    }/${verificationToken}`;

    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Verify your Email',
      message: `Click this link to verify your email: ${verificationUrl}`,
    });

    return res.status(HTTPStatus.CREATED).json({
      statusCode: HTTPStatus.CREATED,
      status: HTTPStatus[HTTPStatus.CREATED],
      info: `A verification email has been sent to ${user.email}`,
      user: user.toAuthJSON(),
      message: 'User created',
    });
  } catch (e) {
    next(e);
  }
}

function login(req, res, next) {
  try {
    const { user } = req;

    if (!user.isVerified) {
      const err = new ApiError(
        HTTPStatus.UNAUTHORIZED,
        HTTPStatus[HTTPStatus.UNAUTHORIZED],
        'Your email is not verified, please verify',
      );
      return next(err);
    }

    const token = user.createToken();

    return res.status(HTTPStatus.OK).json({
      statusCode: HTTPStatus.OK,
      status: HTTPStatus[HTTPStatus.OK],
      token: `Bearer ${token}`,
      user: user.toAuthJSON(),
      message: 'Successful login',
    });
  } catch (e) {
    next(e);
    // return res.sendStatus(HTTPStatus.UNAUTHORIZED);
  }
}

function logout(req, res) {
  res.clearCookie('t');
  return res.sendStatus(HTTPStatus.OK);
}

function getMe(req, res, next) {
  try {
    const { user } = req;
    return res.status(HTTPStatus.OK).json({
      statusCode: HTTPStatus.OK,
      status: HTTPStatus[HTTPStatus.OK],
      user: user,
      message: 'Fetched current user',
    });
  } catch (e) {
    next(e);
  }
}

async function verifyeMail(req, res, next) {
  const emailVerificationToken = generateTokenHash(req.params.token);

  try {
    const user = await User.findOne({ emailVerificationToken });

    if (!user) {
      const err = new ApiError(
        HTTPStatus.BAD_REQUEST,
        HTTPStatus[HTTPStatus.BAD_REQUEST],
        'Invalid or expired verification token',
      );
      return next(err);
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;

    await user.save();

    return res.status(HTTPStatus.OK).json({
      statusCode: HTTPStatus.OK,
      status: HTTPStatus[HTTPStatus.OK],
      user: user.toAuthJSON(),
      message: 'User has been verified',
    });
  } catch (e) {
    next(e);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      const err = new ApiError(
        HTTPStatus.NOT_FOUND,
        HTTPStatus[HTTPStatus.NOT_FOUND],
        'No user found with given email',
      );
      return next(err);
    }

    if (!user.isVerified) {
      const err = new ApiError(
        HTTPStatus.UNAUTHORIZED,
        HTTPStatus[HTTPStatus.UNAUTHORIZED],
        'Your email is not verified. Please verify',
      );
      return next(err);
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `${emailUrls(req).password}/${resetToken}`;
    const message = `Click this link to reset your password ${resetUrl}`;

    await sendEmail({
      to: user.email,
      subject: 'Your password reset token',
      message,
    });

    return res.status(HTTPStatus.OK).json({
      statusCode: HTTPStatus.OK,
      status: HTTPStatus[HTTPStatus.OK],
      user: user.toAuthJSON(),
      message: 'user password reset token sent',
    });
  } catch (e) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    next(e);
  }
}

async function resetPassword(req, res, next) {
  const resetPasswordToken = generateTokenHash(req.params.resetToken);

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      const err = new ApiError(
        HTTPStatus.BAD_REQUEST,
        HTTPStatus[HTTPStatus.BAD_REQUEST],
        'Invalid or expired reset token',
      );
      return next(err);
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    const token = user.createToken();

    return res.status(HTTPStatus.OK).json({
      statusCode: HTTPStatus.OK,
      status: HTTPStatus[HTTPStatus.OK],
      user: user.toAuthJSON(),
      message: 'User password has been reset',
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  registerUser,
  login,
  logout,
  getMe,
  verifyeMail,
  forgotPassword,
  resetPassword,
};
