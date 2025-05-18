const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');

const saltRounds = 10;

// user signin
router.post('/signup', (req, res, next) => {
  const { email, password, name } = req.body;

  // check if required data is provided
  if (!email || !password || !name) {
    res.status(400).json({ message: 'Provide email, password and name' });
  }

  // check email format
  const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Provide valid email address' });
  }

  //check password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        'Password must have at least six characters. It must contain numbers, lower case letters and upper case letters.',
    });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = {
        email: email,
        password: hashedPassword,
        name: name,
      };

      return User.create(newUser);
    })
    .then((createdUser) => {
      const { email, name, _id } = createdUser;
      const user = { email, name, _id };

      res.status(201).json({ user: user });
    })
    .catch((error) => {
      console.log('Error trying to get user');
      next(error);
    });
});

// user login
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Provide email and password' });
    return;
  }

  // Check if user with same email exists
  User.findOne({ email })
    .then((foundUser) => {
      //check if user was found (exists)
      if (!foundUser) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      // compare provided password with password (hash) from foundUser in DB
      const comparePassword = bcrypt.compareSync(password, foundUser.password);

      if (comparePassword) {
        // omit password from user object
        const { _id, email, name } = foundUser;

        // create object for payload
        const payload = { _id, email, name };

        // create and sign token (jwt)
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '6h' });

        // send authToken
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: 'Unable to authenticate user. Check email or password' });
      }
    })
    .catch((error) => {
      console.log('Error trying to get user, user does not exist. Please signup first.');
      next(error);
    });
});

router.get('/verify', isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log('req.payload', req.payload);
  res.json(req.payload);
});

module.exports = router;
