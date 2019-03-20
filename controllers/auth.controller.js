const HTTPStatus = require('http-status');
const jwt = require('jsonwebtoken');

const config = require('../config/config');

function login(req, res) {
  try {
    const { user } = req;
    const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '1d' });

    res.cookie('t', token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      secure: true
    });

    return res.status(HTTPStatus.OK).json({
      token: `Bearer ${token}`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (e) {
    return res.sendStatus(HTTPStatus.UNAUTHORIZED);
  }
}

function logout(req, res) {
  res.clearCookie('t');
  return res.sendStatus(HTTPStatus.OK);
}

module.exports = {
  login,
  logout
};
