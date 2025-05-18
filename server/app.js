require('dotenv/config'); // make use of environment variables (.env)
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = 5005;

mongoose
  .connect('mongodb://127.0.0.1:27017/cohort-tools-api')
  .then((x) => {
    console.log(`connected to database: ${x.connections[0].name}`);
  })
  .catch((err) => console.log('error while connecting to database'));

mongoose.set('runValidators', true);
// STATIC DATA

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
app.use(
  cors({
    origin: ['http://localhost:5173'],
  })
);
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
app.get('/docs', (req, res) => {
  res.sendFile(__dirname + '/views/docs.html');
});

app.use('/auth', require('./routes/auth.routes'));
app.use('/api', require('./routes/user.routes'));
app.use('/api', require('./routes/cohort.routes'));
app.use('/api', require('./routes/student.routes'));

// Error handling
const { errorHandler, notFoundHandler } = require('./middleware/error-handling');
app.use(notFoundHandler);
app.use(errorHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
