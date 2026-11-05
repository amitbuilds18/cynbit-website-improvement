const db = require('../config/db');
const path = require('path');

// Helper to generate application number
function generateAppNumber() {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `CYN-2026-${randomPart}`;
}

// @desc    Submit new job application
// @route   POST /api/applications
exports.submitApplication = async (req, res) => {
  try {
    const {
      jobId,
      fullName,
      email,
      phone,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      university,
      degree,
      specialization,
      graduationYear,
      gradeType,
      gradeValue,
      skills,
      coverLetter
    } = req.body;

    // Server-side validation
    if (!jobId || !fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing mandatory fields: Job, Full Name, Email, and Phone number are required.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Check if resume file was uploaded
    let resumeFilename = null;
    let resumeOriginalName = null;
    let resumePath = null;

    if (req.file) {
      resumeFilename = req.file.filename;
      resumeOriginalName = req.file.originalname;
      resumePath = `/uploads/${req.file.filename}`;
    }

    const parsedSkills = typeof skills === 'string' 
      ? (skills.startsWith('[') ? JSON.parse(skills) : skills.split(',').map(s => s.trim())) 
      : (Array.isArray(skills) ? skills : []);

    // 1. Create candidate record
    const candRes = await db.query(`
      INSERT INTO candidates (
        full_name, email, phone, linkedin_url, github_url, portfolio_url,
        university, degree, specialization, graduation_year, grade_type, grade_value, skills
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id;
    `, [
      fullName,
      email.toLowerCase(),
      phone,
      linkedinUrl || '',
      githubUrl || '',
      portfolioUrl || '',
      university || '',
      degree || '',
      specialization || '',
      graduationYear || '2026',
      gradeType || 'CGPA',
      gradeValue ? parseFloat(gradeValue) : null,
      JSON.stringify(parsedSkills)
    ]);

    const candidateId = candRes.rows[0].id;

    // 2. Check for duplicate application
    const dupCheck = await db.query(
      'SELECT id, application_number FROM applications WHERE job_id = $1 AND candidate_id = $2',
      [jobId, candidateId]
    );

    if (dupCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        applicationNumber: dupCheck.rows[0].application_number,
        message: 'An active application for this position already exists with this profile.'
      });
    }

    // 3. Create application record
    const appNumber = generateAppNumber();
    const appRes = await db.query(`
      INSERT INTO applications (
        application_number, job_id, candidate_id, status, cover_letter,
        resume_original_name, resume_filename, resume_path
      )
      VALUES ($1, $2, $3, 'applied', $4, $5, $6, $7)
      RETURNING id, application_number, status, created_at;
    `, [
      appNumber,
      parseInt(jobId, 10),
      candidateId,
      coverLetter || '',
      resumeOriginalName,
      resumeFilename,
      resumePath
    ]);

    const newApp = appRes.rows[0];

    // 4. Create initial timeline event
    await db.query(`
      INSERT INTO application_timeline (application_id, stage, title, description)
      VALUES ($1, $2, $3, $4);
    `, [
      newApp.id,
      'applied',
      'Application Blueprint Received',
      'Your profile and technical credentials have been successfully logged in the BitElevate talent engine.'
    ]);

    return res.status(201).json({
      success: true,
      message: 'Application blueprint submitted successfully!',
      data: {
        applicationNumber: newApp.application_number,
        status: newApp.status,
        createdAt: newApp.created_at,
        trackingUrl: `/track?app=${newApp.application_number}&email=${encodeURIComponent(email)}`
      }
    });
  } catch (err) {
    console.error('Error submitting application:', err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while saving your application. Please check all fields and try again.'
    });
  }
};

// @desc    Track application status
// @route   GET /api/applications/track
exports.trackApplication = async (req, res) => {
  try {
    const { applicationNumber, email } = req.query;

    if (!applicationNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your Application Reference Number (e.g., CYN-2026-XXXX).'
      });
    }

    // Query application
    let queryText = `
      SELECT 
        a.id, a.application_number, a.status, a.cover_letter, a.score,
        a.resume_original_name, a.resume_filename, a.resume_path, a.created_at, a.updated_at,
        c.full_name, c.email, c.phone, c.linkedin_url, c.github_url, c.portfolio_url,
        c.university, c.degree, c.specialization, c.graduation_year, c.grade_type, c.grade_value, c.skills,
        j.title AS job_title, j.department AS job_department, j.type AS job_type, j.slug AS job_slug
      FROM applications a
      JOIN candidates c ON a.candidate_id = c.id
      JOIN jobs j ON a.job_id = j.id
      WHERE UPPER(a.application_number) = UPPER($1)
    `;
    const params = [applicationNumber.trim()];

    if (email && email.trim() !== '') {
      queryText += ' AND LOWER(c.email) = LOWER($2)';
      params.push(email.trim());
    }

    const result = await db.query(queryText, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No matching application found. Please verify the Application Number and Email.'
      });
    }

    const application = result.rows[0];

    // Fetch timeline events
    const timelineRes = await db.query(`
      SELECT stage, title, description, created_at
      FROM application_timeline
      WHERE application_id = $1
      ORDER BY created_at ASC
    `, [application.id]);

    application.timeline = timelineRes.rows;

    return res.status(200).json({
      success: true,
      data: application
    });
  } catch (err) {
    console.error('Error tracking application:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving application tracking details.' });
  }
};

// @desc    Admin / Recruiter: Get all applications with stats
// @route   GET /api/applications/admin/list
exports.getRecruiterApplications = async (req, res) => {
  try {
    const queryText = `
      SELECT 
        a.id, a.application_number, a.status, a.cover_letter, a.score, a.internal_notes,
        a.resume_original_name, a.resume_filename, a.resume_path, a.created_at, a.updated_at,
        c.full_name, c.email, c.phone, c.linkedin_url, c.github_url, c.portfolio_url,
        c.university, c.degree, c.specialization, c.graduation_year, c.grade_type, c.grade_value, c.skills,
        j.title AS job_title, j.department AS job_department, j.type AS job_type
      FROM applications a
      JOIN candidates c ON a.candidate_id = c.id
      JOIN jobs j ON a.job_id = j.id
      ORDER BY a.created_at DESC
    `;

    const result = await db.query(queryText);
    const applications = result.rows;

    // Compute metrics
    const metrics = {
      total: applications.length,
      applied: applications.filter(a => a.status === 'applied').length,
      reviewing: applications.filter(a => a.status === 'reviewing').length,
      assessment: applications.filter(a => a.status === 'assessment').length,
      interview: applications.filter(a => a.status === 'interview').length,
      offered: applications.filter(a => a.status === 'offered').length,
      rejected: applications.filter(a => a.status === 'rejected').length
    };

    return res.status(200).json({
      success: true,
      metrics,
      data: applications
    });
  } catch (err) {
    console.error('Error fetching recruiter applications:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving recruiter application pool.' });
  }
};

// @desc    Admin / Recruiter: Update candidate application status & notes
// @route   PATCH /api/applications/admin/:id/status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, internalNotes, timelineTitle, timelineDesc } = req.body;

    const validStages = ['applied', 'reviewing', 'assessment', 'interview', 'offered', 'rejected'];
    if (!validStages.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid hiring stage.' });
    }

    const appRes = await db.query('SELECT id, application_number FROM applications WHERE id = $1', [id]);
    if (appRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Update status and notes
    await db.query(`
      UPDATE applications 
      SET status = $1, internal_notes = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [status, internalNotes || '', id]);

    // Add timeline record
    const stageTitles = {
      applied: 'Application Received',
      reviewing: 'Profile Under Review',
      assessment: 'Technical Coding Assessment Assigned',
      interview: 'Architectural Interview Scheduled',
      offered: 'Official Offer Extended',
      rejected: 'Application Concluded'
    };

    await db.query(`
      INSERT INTO application_timeline (application_id, stage, title, description)
      VALUES ($1, $2, $3, $4)
    `, [
      id,
      status,
      timelineTitle || stageTitles[status] || `Moved to ${status}`,
      timelineDesc || `Candidate application status advanced to ${status} by Cynbit Engineering Panel.`
    ]);

    return res.status(200).json({
      success: true,
      message: `Candidate application advanced to ${status}.`
    });
  } catch (err) {
    console.error('Error updating application status:', err);
    return res.status(500).json({ success: false, message: 'Server error updating status.' });
  }
};
