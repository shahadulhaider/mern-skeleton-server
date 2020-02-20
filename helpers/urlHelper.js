const config = require('../config/config');

exports.emailUrls = function(req) {
  let urls = {};
  if (config.nodeEnv === 'production') {
    urls.password = `${req.protocol}://${req.get('host')}/auth/resetPassword`;
    urls.verification = `${req.protocol}://${req.get('host')}/auth/verifyemail`;
  } else if (config.nodeEnv === 'development') {
    urls.password = `http://localhost:3000/auth/resetPassword`;
    urls.verification = `http://localhost:3000/auth/verifyemail`;
  }

  return urls;
};
