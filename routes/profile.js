const express = require('express');
const router  = express.Router();

router.get('/:id', (req, res, next) => {
  const user = req.user;

  res.render('/profile', { user });
});

module.exports = router;
