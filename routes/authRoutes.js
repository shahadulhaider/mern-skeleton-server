const { Router } = require('express');

const { celebrate } = require('celebrate');
const authCtrl = require('../controllers/auth.controller');
const { loginUser } = require('../helpers/auth.validation');
const { authLocal } = require('../services/auth');

const router = Router();

router.get('/logout', authCtrl.logout);
router.post('/login', celebrate(loginUser), authLocal, authCtrl.login);

module.exports = router;
