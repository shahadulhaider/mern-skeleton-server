const { Router } = require('express');
const userCtrl = require('../controllers/user.controller');

const router = Router();


router.get('/', userCtrl.list);
router.post('/', userCtrl.register);

// router.route('/:userId')
//   .get(userCtrl.read)
//   .put(userCtrl.update)
//   .delete(userCtrl.remove);


// router.param('userId', userCtrl.userById);

module.exports = router;
