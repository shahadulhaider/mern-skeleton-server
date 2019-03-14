const { Router } = require('express');

const authCtrl = require('../controllers/auth.controller');
const { authLocal } = require('../services/auth');

const router = Router();

router.get('/logout', authCtrl.logout);
router.post('/login', authLocal, authCtrl.login);

module.exports = router;
