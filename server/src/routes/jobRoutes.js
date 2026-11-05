const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.get('/', jobController.getJobs);
router.get('/:slug', jobController.getJobBySlug);

module.exports = router;
