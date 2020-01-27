const HTTPStatus = require('http-status');
const jwt = require('jsonwebtoken');

const config = require('../config/config');

function login(req, res, next) {
  try {
    const { user } = req;
    const token = jwt.sign({ _id: user._id }, config.jwtSecret, {
      expiresIn: '1d',
    });

    res.cookie('t', token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      secure: true,
    });

    return res.status(HTTPStatus.OK).json({
      statusCode: HTTPStatus.OK,
      status: HTTPStatus[HTTPStatus.OK],
      data: {
        token: `Bearer ${token}`,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      },
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

module.exports = {
  login,
  logout,
};
