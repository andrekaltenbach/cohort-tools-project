const router = require('express').Router();
const Student = require('../models/Student.model');

// Creates a new student
router.post('/students', (req, res, next) => {
  Student.create(req.body)
    .then((student) => {
      console.log('create student succesful');
      res.json(student);
    })
    .catch((error) => next(error));
});

// Retrieves all of the students in the database collection
router.get('/students', (req, res, next) => {
  Student.find({})
    .populate('cohort')
    .then((students) => {
      console.log('received data from Student');
      res.json(students);
    })
    .catch((error) => next(error));
});

// Retrieves all of the students for a given cohort
router.get('/students/cohort/:cohortId', (req, res, next) => {
  Student.find({ cohort: req.params.cohortId })
    .populate('cohort')
    .then((students) => {
      console.log('received data from Student, cohort: ' + req.params.cohortId);
      res.json(students);
    })
    .catch((error) => next(error));
});

// Retrieves a student by id
router.get('/students/:studentId', (req, res, next) => {
  Student.findById(req.params.studentId)
    .populate('cohort')
    .then((student) => {
      console.log('received data from Student');
      res.json(student);
    })
    .catch((error) => next(error));
});

// Updates a student by id
router.put('/students/:studentId', (req, res, next) => {
  Student.findByIdAndUpdate(req.params.studentId, req.body, { new: true })
    .then((student) => {
      console.log('received data from Student');
      res.json(student);
    })
    .catch((error) => next(error));
});

// Deletes a student by id
router.delete('/students/:studentId', (req, res, next) => {
  Student.findByIdAndDelete(req.params.studentId)
    .then((student) => {
      console.log('received data from Student');
      res.json(student);
    })
    .catch((error) => next(error));
});

module.exports = router;
