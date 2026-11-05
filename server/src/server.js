const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');
const { seed } = require('./seed/seedData');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & utility middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-recruiter-key']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads directory (for resumes)
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// API Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Cynbit BitElevate Talent API',
    database: db.getIsNeon() ? 'PostgreSQL (Neon Cloud)' : 'PostgreSQL In-Memory Engine',
    version: '1.0.0'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Server Initialization
async function startServer() {
  try {
    console.log('--- Initializing Cynbit BitElevate Talent API ---');
    await db.initDatabase();
    
    // Auto-seed if needed
    await seed();

    const serverInstance = app.listen(PORT, '127.0.0.1', () => {
      console.log(`====================================================`);
      console.log(` Cynbit Talent API Server Running on Port ${PORT}`);
      console.log(` Health Check: http://127.0.0.1:${PORT}/api/health`);
      console.log(` Database:     ${db.getIsNeon() ? 'PostgreSQL (Neon Cloud)' : 'PostgreSQL In-Memory Engine'}`);
      console.log(`====================================================`);
    });
    return serverInstance;
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
