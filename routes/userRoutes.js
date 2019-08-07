const { Router } = require('express');
const expressJoi = require('express-joi-validation');

const userCtrl = require('../controllers/user.controller');
const { createUser, updateUser } = require('../helpers/user.validation');
const { authJWT } = require('../services/auth');

const router = Router();

const validator = expressJoi.createValidator({ passError: true });

router.get('/', userCtrl.getAllUser);
router.post('/', validator.body(createUser), userCtrl.createUser);

router.get('/:id', authJWT, userCtrl.getUserById);
router.put('/:id', authJWT, validator.body(updateUser), userCtrl.updateUser);
router.delete('/:id', authJWT, userCtrl.deleteUser);

module.exports = router;
