const { Router } = require('express');
const userCtrl = require('../controllers/user.controller');

const { authJWT } = require('../services/auth');

const router = Router();


router.get('/', userCtrl.getAllUser);
router.post('/', userCtrl.createUser);

router.get('/:id', userCtrl.getUserById);
router.put('/:id', authJWT, userCtrl.updateUser);
router.delete('/:id', authJWT, userCtrl.deleteUser);

module.exports = router;
