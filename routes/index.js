const { Router } = require('express');

const router = Router();

/* GET index page. */
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to mern-skeleton api :-)'
  });
});

module.exports = router;
