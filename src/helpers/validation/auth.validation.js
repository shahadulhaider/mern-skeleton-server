const { celebrate, Joi, Segments } = require('celebrate');

const passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}/;

const registerUserSchema = {
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string()
      .alphanum()
      .min(4)
      .max(30)
      .required(),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .regex(passwordReg)
      .required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
  }),
};

const loginUserSchema = {
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
  registerValidation: celebrate(registerUserSchema),
  loginValidation: celebrate(loginUserSchema),
};
