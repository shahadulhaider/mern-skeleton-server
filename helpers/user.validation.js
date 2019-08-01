const Joi = require('@hapi/joi');

const passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}/;

const createUser = {
  username: Joi.string().alphanum().min(4).max(30)
    .required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().regex(passwordReg).required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required()
};

module.exports = {
  passwordReg,
  createUser
};
