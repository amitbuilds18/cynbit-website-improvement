const db = require('../config/db');

// @desc    Get all active jobs (with optional department, type, search filters)
// @route   GET /api/jobs
exports.getJobs = async (req, res) => {
  try {
    const { department, type, search } = req.query;
    const result = await db.query('SELECT * FROM jobs WHERE is_active = true ORDER BY id ASC');
    let jobs = result.rows;

    if (department && department !== 'All') {
      jobs = jobs.filter(j => j.department.toLowerCase() === department.toLowerCase());
    }

    if (type && type !== 'All') {
      jobs = jobs.filter(j => j.type.toLowerCase() === type.toLowerCase());
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      jobs = jobs.filter(j => 
        j.title.toLowerCase().includes(q) || 
        j.description.toLowerCase().includes(q) ||
        (Array.isArray(j.tags) && j.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Departments for filter chips
    const allJobsRes = await db.query('SELECT department, type FROM jobs WHERE is_active = true');
    const departments = ['All', ...new Set(allJobsRes.rows.map(j => j.department))];
    const types = ['All', 'Internship', 'Full-Time'];

    return res.status(200).json({
      success: true,
      count: jobs.length,
      departments,
      types,
      data: jobs
    });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving jobs.' });
  }
};

// @desc    Get single job by slug
// @route   GET /api/jobs/:slug
exports.getJobBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await db.query('SELECT * FROM jobs WHERE slug = $1 AND is_active = true', [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job opening not found.' });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching job details:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving job details.' });
  }
};
