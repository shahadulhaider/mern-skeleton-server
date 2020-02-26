const { celebrate, Joi, Segments } = require('celebrate');

const passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}/;

const updateUser = {
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string()
      .alphanum()
      .min(4)
      .max(30),
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().regex(passwordReg),
    firstname: Joi.string(),
    lastname: Joi.string(),
  }),
};

module.exports = {
  passwordReg,
  updateUserValidation: celebrate(updateUser),
};
