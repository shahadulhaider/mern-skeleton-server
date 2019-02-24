const Joi = require('joi');

const passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

const createUser = {
  userName: Joi.string().alphanum().min(4).required(),
  email: Joi.string().email().required(),
  password: Joi.string().regex(passwordReg).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
};

module.exports = {
  passwordReg,
  createUser
};
