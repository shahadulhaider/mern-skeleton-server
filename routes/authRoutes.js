const { Router } = require('express');

const authCtrl = require('../controllers/auth.controller');
const {
  loginValidation,
  registerValidation,
} = require('../helpers/validation/auth.validation');
const { authLocal, authJWT } = require('../services/auth');

const router = Router();

router.post('/register', registerValidation, authCtrl.registerUser);
router.post('/login', loginValidation, authLocal, authCtrl.login);
router.get('/logout', authCtrl.logout);
router.get('/me', authJWT, authCtrl.getMe);
router.post('/verifyemail/:token', authCtrl.verifyeMail);
router.post('/forgotpassword', authCtrl.forgotPassword);
router.put('/resetpassword/:resetToken', authCtrl.resetPassword);

module.exports = router;
