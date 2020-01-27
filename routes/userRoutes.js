const { Router } = require('express');
const { celebrate } = require('celebrate');
const userCtrl = require('../controllers/user.controller');
const { createUser, updateUser } = require('../helpers/user.validation');
const { authJWT } = require('../services/auth');

const router = Router();

router
  .route('/')
  .get(userCtrl.getAllUser)
  .post(celebrate(createUser), userCtrl.createUser);

router
  .route('/:id')
  .get(authJWT, userCtrl.getUserById)
  .put(celebrate(updateUser), authJWT, userCtrl.updateUser)
  .delete(authJWT, userCtrl.deleteUser);

module.exports = router;
