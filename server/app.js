const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Cohort = require('./models/Cohort.model');
const Student = require('./models/Student.model');
const PORT = 5005;

// const cohorts = require('./cohorts.json');
// const students = require('./students.json');

mongoose
  .connect('mongodb://127.0.0.1:27017/cohort-tools-api')
  .then((x) => {
    console.log(`connected to database: ${x.connections[0].name}`);
  })
  .catch((err) => console.log('error while connecting to database'));

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

app.get('/api/cohorts', (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log('received data from Cohort');
      res.json(cohorts);
    })
    .catch((err) => console.log(err));
});

app.get('/api/students', (req, res) => {
  Student.find({})
    .then((students) => {
      console.log('received data from Student');
      res.json(students);
    })
    .catch((err) => console.log(err));
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
