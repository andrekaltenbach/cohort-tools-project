const router = require('express').Router();
const Cohort = require('../models/Cohort.model');

// Creates a new cohort
router.post('/cohorts', (req, res, next) => {
  const newCohort = req.body;
  Cohort.create(newCohort)
    .then((cohort) => res.status(201).json(cohort))
    .catch((error) => {
      next(error);
    });
});

// Retrieves all of the cohorts in the database collection
router.get('/cohorts', (req, res, next) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log('received data from Cohort');
      res.json(cohorts);
    })
    .catch((error) => {
      next(error);
    });
});

// Retrieves a specific cohort by id
router.get('/cohorts/:cohortId', (req, res, next) => {
  const { cohortId } = req.params;
  Cohort.findById(cohortId)
    .then((cohort) => {
      res.status(200).json(cohort);
    })
    .catch((error) => {
      next(error);
    });
});

// Updates a specific cohort by id
router.put('/cohorts/:cohortId', (req, res, next) => {
  const { cohortId } = req.params;
  console.log(cohortId);
  const updateCohort = req.body;
  Cohort.findByIdAndUpdate(cohortId, updateCohort, { new: true })
    .then((cohort) => res.status(200).json(cohort))
    .catch((error) => {
      next(error);
    });
});

// Deletes a specific cohort by id
router.delete('/cohorts/:cohortId', (req, res, next) => {
  const { cohortId } = req.params;
  Cohort.findByIdAndDelete(cohortId)
    .then((cohort) => res.status(204).send())
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
