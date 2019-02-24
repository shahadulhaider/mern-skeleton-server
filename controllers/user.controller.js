const HTTPStatus = require('http-status');
const User = require('../models/user.model');


async function getAllUser(req, res) {
  try {
    const users = await User.find().sort({ cratedAt: -1 });
    return res.status(HTTPStatus.OK).json(users);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

async function createUser(req, res) {
  try {
    const user = await User.create(req.body);
    return res.status(HTTPStatus.CREATED).json(user.toAuthJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);

    return res.status(HTTPStatus.OK).json(user);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

async function updateUser(req, res) {
  try {
    let user = await User.findById(req.params.id);

    if (!user.equals(req.user._id)) {
      return res.sendStatus(HTTPStatus.UNAUTHORIZED);
    }

    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    user = await user.save();
    return res.status(HTTPStatus.OK).json(user);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user.equals(req.user._id)) {
      return res.sendStatus(HTTPStatus.UNAUTHORIZED);
    }

    await user.remove();
    return res.sendStatus(HTTPStatus.OK);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

module.exports = {
  getAllUser,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};
