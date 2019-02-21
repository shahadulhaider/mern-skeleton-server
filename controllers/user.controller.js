const HTTPStatus = require('http-status');
const User = require('../models/user.model');

async function register(req, res) {
  try {
    const user = await User.create(req.body);
    return res.status(HTTPStatus.CREATED).json(user);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

async function list(req, res) {
  try {
    const users = await User.find().sort({ cratedAt: -1 });
    return res.status(HTTPStatus.OK).json(users);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

module.exports = {
  register,
  list
};
