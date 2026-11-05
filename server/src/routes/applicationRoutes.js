const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const upload = require('../middleware/upload');

// Candidate routes
router.post('/', upload.single('resume'), applicationController.submitApplication);
router.get('/track', applicationController.trackApplication);

// Recruiter routes
router.get('/admin/list', applicationController.getRecruiterApplications);
router.patch('/admin/:id/status', applicationController.updateApplicationStatus);

module.exports = router;
