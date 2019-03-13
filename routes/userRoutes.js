const { Router } = require('express');
const validate = require('express-validation');
const userCtrl = require('../controllers/user.controller');
const { createUser } = require('../helpers/user.validation');
const { authJWT } = require('../services/auth');

const router = Router();


router.get('/', userCtrl.getAllUser);
router.post('/', validate(createUser), userCtrl.createUser);

router.get('/:id', userCtrl.getUserById);
router.put('/:id', authJWT, userCtrl.updateUser);
router.delete('/:id', authJWT, userCtrl.deleteUser);

module.exports = router;