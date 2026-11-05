const { Pool } = require('pg');
require('dotenv').config();

let pool = null;
let isNeon = false;

// In-Memory store fallback for offline/local resilience
const mockStore = {
  jobs: [],
  candidates: [],
  applications: [],
  timeline: []
};

async function initDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString && connectionString.trim() !== '') {
    try {
      console.log('Connecting to PostgreSQL (Neon cloud)...');
      pool = new Pool({
        connectionString,
        ssl: {
          rejectUnauthorized: false
        },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      // Test connection
      const client = await pool.connect();
      console.log('Successfully connected to PostgreSQL on Neon!');
      isNeon = true;

      // Create Tables
      await client.query(`
        CREATE TABLE IF NOT EXISTS jobs (
          id SERIAL PRIMARY KEY,
          slug VARCHAR(120) UNIQUE NOT NULL,
          title VARCHAR(200) NOT NULL,
          department VARCHAR(100) NOT NULL,
          type VARCHAR(50) NOT NULL,
          location VARCHAR(100) DEFAULT 'Remote / Jaipur, India',
          description TEXT NOT NULL,
          requirements JSONB DEFAULT '[]',
          responsibilities JSONB DEFAULT '[]',
          tags JSONB DEFAULT '[]',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS candidates (
          id SERIAL PRIMARY KEY,
          full_name VARCHAR(150) NOT NULL,
          email VARCHAR(150) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          linkedin_url VARCHAR(300),
          github_url VARCHAR(300),
          portfolio_url VARCHAR(300),
          university VARCHAR(200),
          degree VARCHAR(150),
          specialization VARCHAR(150),
          graduation_year VARCHAR(20),
          grade_type VARCHAR(20) DEFAULT 'CGPA',
          grade_value NUMERIC(5,2),
          skills JSONB DEFAULT '[]',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS applications (
          id SERIAL PRIMARY KEY,
          application_number VARCHAR(50) UNIQUE NOT NULL,
          job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
          candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
          status VARCHAR(50) DEFAULT 'applied',
          cover_letter TEXT,
          resume_original_name VARCHAR(255),
          resume_filename VARCHAR(255),
          resume_path VARCHAR(500),
          resume_url VARCHAR(500),
          internal_notes TEXT,
          score INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS application_timeline (
          id SERIAL PRIMARY KEY,
          application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
          stage VARCHAR(50) NOT NULL,
          title VARCHAR(200) NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      client.release();
      console.log('PostgreSQL (Neon) tables verified and initialized.');
      return;
    } catch (err) {
      console.warn('Could not connect to Neon PostgreSQL:', err.message);
      console.log('Falling back to In-Memory Relational Engine for seamless local execution.');
      pool = null;
      isNeon = false;
    }
  } else {
    console.log('No DATABASE_URL provided. Running with In-Memory Relational Engine (PostgreSQL interface compatible).');
    isNeon = false;
  }
}

// Universal query function handling both Neon pool and fallback
async function query(text, params = []) {
  if (pool) {
    return pool.query(text, params);
  }

  // Fallback simulator for standard operations
  return runMockQuery(text, params);
}

function runMockQuery(text, params) {
  const t = text.trim();

  // JOBS: SELECT ALL
  if (t.startsWith('SELECT * FROM jobs WHERE is_active = true') || (t.includes('FROM jobs') && !t.includes('slug =') && !t.includes('id ='))) {
    let result = [...mockStore.jobs.filter(j => j.is_active !== false)];
    return { rows: result, rowCount: result.length };
  }

  // JOBS: SELECT BY SLUG
  if (t.includes('FROM jobs WHERE slug =')) {
    const slug = params[0];
    const job = mockStore.jobs.find(j => j.slug === slug);
    return { rows: job ? [job] : [], rowCount: job ? 1 : 0 };
  }

  // JOBS: SELECT BY ID
  if (t.includes('FROM jobs WHERE id =')) {
    const id = parseInt(params[0], 10);
    const job = mockStore.jobs.find(j => j.id === id);
    return { rows: job ? [job] : [], rowCount: job ? 1 : 0 };
  }

  // CANDIDATES: INSERT
  if (t.startsWith('INSERT INTO candidates')) {
    const id = mockStore.candidates.length + 1;
    const candidate = {
      id,
      full_name: params[0],
      email: params[1],
      phone: params[2],
      linkedin_url: params[3],
      github_url: params[4],
      portfolio_url: params[5],
      university: params[6],
      degree: params[7],
      specialization: params[8],
      graduation_year: params[9],
      grade_type: params[10],
      grade_value: params[11],
      skills: typeof params[12] === 'string' ? JSON.parse(params[12]) : (params[12] || []),
      created_at: new Date()
    };
    mockStore.candidates.push(candidate);
    return { rows: [candidate], rowCount: 1 };
  }

  // APPLICATIONS: CHECK DUPLICATE
  if (t.includes('FROM applications WHERE job_id =') && t.includes('candidate_id =')) {
    const jobId = parseInt(params[0], 10);
    const candidateId = parseInt(params[1], 10);
    const app = mockStore.applications.find(a => a.job_id === jobId && a.candidate_id === candidateId);
    return { rows: app ? [app] : [], rowCount: app ? 1 : 0 };
  }

  // APPLICATIONS: INSERT
  if (t.startsWith('INSERT INTO applications')) {
    const id = mockStore.applications.length + 1;
    let status = 'applied';
    let coverLetter = '';
    let resumeOriginalName = null;
    let resumeFilename = null;
    let resumePath = null;
    let score = 85;

    if (params.length === 7) {
      // From applicationController: [appNumber, jobId, candidateId, coverLetter, resumeOriginalName, resumeFilename, resumePath]
      status = 'applied';
      coverLetter = params[3];
      resumeOriginalName = params[4];
      resumeFilename = params[5];
      resumePath = params[6];
    } else if (params.length >= 8) {
      // From seed: [appNumber, jobId, candidateId, status, coverLetter, score, resumeOriginalName, resumeFilename, resumePath]
      status = params[3] || 'applied';
      coverLetter = params[4];
      score = params[5] || 85;
      resumeOriginalName = params[6];
      resumeFilename = params[7];
      resumePath = params[8];
    }

    const app = {
      id,
      application_number: params[0],
      job_id: parseInt(params[1], 10),
      candidate_id: parseInt(params[2], 10),
      status,
      cover_letter: coverLetter,
      resume_original_name: resumeOriginalName,
      resume_filename: resumeFilename,
      resume_path: resumePath,
      resume_url: null,
      internal_notes: '',
      score,
      created_at: new Date(),
      updated_at: new Date()
    };
    mockStore.applications.push(app);
    return { rows: [app], rowCount: 1 };
  }

  // TIMELINE: INSERT
  if (t.startsWith('INSERT INTO application_timeline')) {
    const id = mockStore.timeline.length + 1;
    const item = {
      id,
      application_id: parseInt(params[0], 10),
      stage: params[1],
      title: params[2],
      description: params[3],
      created_at: new Date()
    };
    mockStore.timeline.push(item);
    return { rows: [item], rowCount: 1 };
  }

  // TIMELINE: SELECT BY APPLICATION_ID
  if (t.includes('FROM application_timeline WHERE application_id =') || t.includes('FROM application_timeline\n      WHERE application_id =')) {
    const appId = parseInt(params[0], 10);
    const items = mockStore.timeline.filter(tl => tl.application_id === appId);
    return { rows: items, rowCount: items.length };
  }

  // APPLICATIONS: TRACK BY NUMBER & EMAIL
  if (t.includes('application_number') && (t.includes('WHERE UPPER(a.application_number)') || t.includes('a.application_number ='))) {
    const appNumber = params[0];
    const email = params[1] ? params[1].toLowerCase() : null;

    let app = mockStore.applications.find(a => a.application_number.toUpperCase() === appNumber.toUpperCase());
    if (app) {
      const candidate = mockStore.candidates.find(c => c.id === app.candidate_id);
      if (!email || (candidate && candidate.email.toLowerCase() === email)) {
        const job = mockStore.jobs.find(j => j.id === app.job_id);
        const timeline = mockStore.timeline.filter(tl => tl.application_id === app.id);
        const joined = {
          ...app,
          full_name: candidate ? candidate.full_name : '',
          email: candidate ? candidate.email : '',
          phone: candidate ? candidate.phone : '',
          linkedin_url: candidate ? candidate.linkedin_url : '',
          github_url: candidate ? candidate.github_url : '',
          university: candidate ? candidate.university : '',
          degree: candidate ? candidate.degree : '',
          specialization: candidate ? candidate.specialization : '',
          graduation_year: candidate ? candidate.graduation_year : '',
          skills: candidate ? candidate.skills : [],
          job_title: job ? job.title : 'Software Role',
          job_department: job ? job.department : 'Engineering',
          job_type: job ? job.type : 'Internship',
          timeline
        };
        return { rows: [joined], rowCount: 1 };
      }
    }
    return { rows: [], rowCount: 0 };
  }

  // RECRUITER: SELECT ALL APPLICATIONS
  if (t.includes('FROM applications a') && t.includes('JOIN jobs j') && t.includes('JOIN candidates c')) {
    const joinedList = mockStore.applications.map(app => {
      const candidate = mockStore.candidates.find(c => c.id === app.candidate_id);
      const job = mockStore.jobs.find(j => j.id === app.job_id);
      const timeline = mockStore.timeline.filter(tl => tl.application_id === app.id);
      return {
        ...app,
        full_name: candidate ? candidate.full_name : 'Unknown Candidate',
        email: candidate ? candidate.email : '',
        phone: candidate ? candidate.phone : '',
        linkedin_url: candidate ? candidate.linkedin_url : '',
        github_url: candidate ? candidate.github_url : '',
        portfolio_url: candidate ? candidate.portfolio_url : '',
        university: candidate ? candidate.university : '',
        degree: candidate ? candidate.degree : '',
        specialization: candidate ? candidate.specialization : '',
        graduation_year: candidate ? candidate.graduation_year : '',
        grade_type: candidate ? candidate.grade_type : 'CGPA',
        grade_value: candidate ? candidate.grade_value : 8.5,
        skills: candidate ? candidate.skills : [],
        job_title: job ? job.title : 'General Position',
        job_department: job ? job.department : 'Engineering',
        job_type: job ? job.type : 'Internship',
        timeline
      };
    });
    return { rows: joinedList, rowCount: joinedList.length };
  }

  // APPLICATIONS: SELECT BY ID
  if (t.includes('FROM applications WHERE id =') || t.includes('FROM applications\n      WHERE id =')) {
    const id = parseInt(params[0], 10);
    const app = mockStore.applications.find(a => a.id === id);
    return { rows: app ? [app] : [], rowCount: app ? 1 : 0 };
  }

  // APPLICATIONS: UPDATE STATUS / NOTES
  if (t.startsWith('UPDATE applications SET status =') || t.includes('UPDATE applications \n      SET status =') || t.includes('UPDATE applications')) {
    const newStatus = params[0];
    const appId = parseInt(params[params.length - 1], 10);
    const app = mockStore.applications.find(a => a.id === appId);
    if (app) {
      app.status = newStatus;
      app.updated_at = new Date();
      if (params.length > 2 && typeof params[1] === 'string') {
        app.internal_notes = params[1];
      }
      return { rows: [app], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  return { rows: [], rowCount: 0 };
}

module.exports = {
  initDatabase,
  query,
  getPool: () => pool,
  getIsNeon: () => isNeon,
  mockStore
};
