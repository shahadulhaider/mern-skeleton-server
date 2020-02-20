const { Router } = require('express');
const userCtrl = require('../controllers/user.controller');
const {
  updateUserValidation,
} = require('../helpers/validation/user.validation');
const { authJWT } = require('../services/auth');

const router = Router();

router.route('/').get(userCtrl.getAllUser);

router
  .route('/:id')
  .get(authJWT, userCtrl.getUserById)
  .put(updateUserValidation, authJWT, userCtrl.updateUser)
  .delete(authJWT, userCtrl.deleteUser);

module.exports = router;
