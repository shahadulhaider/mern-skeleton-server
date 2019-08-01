const { Router } = require('express');
const expressJoi = require('express-joi-validation');

const userCtrl = require('../controllers/user.controller');
const { createUser } = require('../helpers/user.validation');
const { authJWT } = require('../services/auth');

const router = Router();

const validator = expressJoi.createValidator({ passError: true });

router.get('/', userCtrl.getAllUser);
router.post('/', validator.body(createUser), userCtrl.createUser);

router.get('/:id', authJWT, userCtrl.getUserById);
router.put('/:id', authJWT, userCtrl.updateUser);
router.delete('/:id', authJWT, userCtrl.deleteUser);

module.exports = router;
