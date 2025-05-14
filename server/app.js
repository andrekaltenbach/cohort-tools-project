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

// cohort routes

app.post('/api/cohorts', (req, res) => {
  const newCohort = req.body;
  Cohort.create(newCohort)
    .then((cohort) => res.status(201).json(cohort))
    .catch((err) => {
      console.log('error: failed to create new cohort');
      console.log(err);
      res.status(500).json({ error: 'failed to create new cohort' });
    });
});

// Cohort routes
// Creates a new cohort
app.post('/api/cohorts', (req, res) => {
  const newCohort = req.body;
  Cohort.create(newCohort)
    .then((cohort) => res.status(201).json(cohort))
    .catch((err) => {
      console.log('error: failed to create new cohort');
      console.log(err);
      res.status(500).json({ error: 'failed to create new cohort' });
    });
});

// Retrieves all of the cohorts in the database collection
app.get('/api/cohorts', (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log('received data from Cohort');
      res.json(cohorts);
    })
    .catch((err) => {
      console.log('error: failed to get cohorts from db');
      console.log(err);
      res.status(500).json({ error: 'failed to get cohorts from db' });
    });
});

// Retrieves a specific cohort by id
app.get('/api/cohorts/:cohortId', (req, res) => {
  const { cohortId } = req.params;
  Cohort.findById(cohortId)
    .then((cohort) => {
      res.status(200).json(cohort);
    })
    .catch((err) => {
      console.log(`error: failed to get cohort with id: ${cohortId}`);
      console.log(err);
      res.status(500).json({ error: `failed to get cohort with id: ${cohortId}` });
    });
});

// Updates a specific cohort by id
app.put('/api/cohorts/:cohortId', (req, res) => {
  const { cohortId } = req.params;
  console.log(cohortId);
  const updateCohort = req.body;
  Cohort.findByIdAndUpdate(cohortId, updateCohort, { new: true })
    .then((cohort) => res.status(200).json(cohort))
    .catch((err) => {
      console.log(`error: failed to get cohort with id: ${cohortId}`);
      console.log(err);
      res.status(500).json({ error: `failed to get cohort with id: ${cohortId}` });
    });
});

// Deletes a specific cohort by id
app.delete('/api/cohorts/:cohortId', (req, res) => {
  const { cohortId } = req.params;
  Cohort.findByIdAndDelete(cohortId)
    .then((cohort) => res.status(204).send())
    .catch((err) => {
      console.log(`error: failed to delete cohort with id: ${cohortId}`);
      console.log(err);
      res.status(500).json({ error: `failed to delete cohort with id: ${cohortId}` });
    });
});

// Students Routes
// Creates a new student
app.post('/api/students', (req, res) => {
  Student.create(req.body)
    .then((student) => {
      console.log('received data from Student');
      res.json(student);
    })
    .catch((err) => console.log(err));
});

// Retrieves all of the students in the database collection
app.get('/api/students', (req, res) => {
  Student.find({})
    .populate('cohort')
    .then((students) => {
      console.log('received data from Student');
      res.json(students);
    })
    .catch((err) => console.log(err));
});

// Retrieves all of the students for a given cohort
app.get('/api/students/cohort/:cohortId', (req, res) => {
  Student.find({ cohort: req.params.cohortId })
    .populate('cohort')
    .then((students) => {
      console.log('received data from Student, cohort: ' + req.params.cohortId);
      res.json(students);
    })
    .catch((err) => console.log(err));
});

// Retrieves a student by id
app.get('/api/students/:studentId', (req, res) => {
  Student.findById(req.params.studentId)
    .populate('cohort')
    .then((student) => {
      console.log('received data from Student');
      res.json(student);
    })
    .catch((err) => console.log(err));
});

// Updates a student by id
app.put('/api/students/:studentId', (req, res) => {
  Student.findByIdAndUpdate(req.params.studentId, req.body)
    .then((student) => {
      console.log('received data from Student');
      res.json(student);
    })
    .catch((err) => console.log(err));
});

// Deletes a student by id
app.delete('/api/students/:studentId', (req, res) => {
  Student.findByIdAndDelete(req.params.studentId)
    .then((student) => {
      console.log('received data from Student');
      res.json(student);
    })
    .catch((err) => console.log(err));
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
