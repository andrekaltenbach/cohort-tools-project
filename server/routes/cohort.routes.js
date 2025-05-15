const router = require('express').Router();
const Cohort = require('../models/Cohort.model');

// Creates a new cohort
router.post('/cohorts', (req, res) => {
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
router.get('/cohorts', (req, res) => {
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
router.get('/cohorts/:cohortId', (req, res) => {
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
router.put('/cohorts/:cohortId', (req, res) => {
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
router.delete('/cohorts/:cohortId', (req, res) => {
  const { cohortId } = req.params;
  Cohort.findByIdAndDelete(cohortId)
    .then((cohort) => res.status(204).send())
    .catch((err) => {
      console.log(`error: failed to delete cohort with id: ${cohortId}`);
      console.log(err);
      res.status(500).json({ error: `failed to delete cohort with id: ${cohortId}` });
    });
});

module.exports = router;
