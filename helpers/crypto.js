const crypto = require("crypto");

exports.generateRandomBytes = function(size) {
  return crypto.randomBytes(size).toString("hex");
};

exports.generateTokenHash = function(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};
