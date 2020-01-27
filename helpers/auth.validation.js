const { Joi, Segments } = require('celebrate');

const passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}/;

const loginUser = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .required()
      .regex(passwordReg),
  }),
};

module.exports = {
  loginUser,
};
