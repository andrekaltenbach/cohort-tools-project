const router = require('express').Router();
const { isAuthenticated } = require('../middleware/jwt.middleware');
const User = require('../models/User.model');

router.get('/users/:id', isAuthenticated, (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => res.status(200).json(user))
    .catch((error) => {
      console.log('Error trying to get user');
      next(error);
    });
});

module.exports = router;
