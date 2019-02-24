const HTTPStatus = require('http-status');


function login(req, res) {
  return res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
}

module.exports = {
  login
};