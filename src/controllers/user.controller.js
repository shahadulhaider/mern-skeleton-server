/* eslint-disable consistent-return */
const HTTPStatus = require('http-status');
const ApiError = require('../helpers/apiError');

const User = require('../models/user.model');

async function getAllUser(req, res, next) {
  try {
    const users = await User.find().sort({ cratedAt: -1 });
    return res.status(HTTPStatus.OK).json({
      statusCode: HTTPStatus.OK,
      status: HTTPStatus[HTTPStatus.OK],
      users,
      message: 'Fetched all users',
    });
  } catch (e) {
    next(e);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    return res.status(HTTPStatus.OK).json({
      statusCode: HTTPStatus.OK,
      status: HTTPStatus[HTTPStatus.OK],
      user: user.toProfileJSON(),
      message: 'Fetched user',
    });
  } catch (e) {
    next(e);
  }
}

async function updateUser(req, res, next) {
  try {
    let user = await User.findById(req.params.id);

    if (!user.equals(req.user._id)) {
      const err = new ApiError(
        HTTPStatus.UNAUTHORIZED,
        HTTPStatus[HTTPStatus.UNAUTHORIZED],
        'Not Authorized to perform this action',
      );
      return next(err);
    }

    Object.keys(req.body).forEach(key => {
      user[key] = req.body[key];
    });

    user = await user.save();
    return res.status(HTTPStatus.OK).json({
      statusCode: HTTPStatus.OK,
      status: HTTPStatus[HTTPStatus.OK],
      user,
      message: 'Updated user',
    });
  } catch (e) {
    next(e);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    if (!user.equals(req.user._id)) {
      const err = new ApiError(
        HTTPStatus.UNAUTHORIZED,
        HTTPStatus[HTTPStatus.UNAUTHORIZED],
        'Not Authorized to perform this action',
      );
      return next(err);
    }

    await user.remove();
    return res.status(HTTPStatus.OK).json({
      statusCode: HTTPStatus.OK,
      status: HTTPStatus[HTTPStatus.OK],
      user,
      message: 'Deleted user',
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
};
