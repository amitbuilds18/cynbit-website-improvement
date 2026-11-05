const fs = require('fs');
const path = require('path');
const { startServer } = require('../src/server');

async function runTests() {
  const PORT = process.env.PORT || 5000;
  const serverInstance = await startServer();

  console.log(`\n==============================================`);
  console.log(`     RUNNING AUTOMATED ENDPOINT TESTS         `);
  console.log(`==============================================\n`);

  try {
    // 1. Health check
    console.log('[TEST 1] Testing GET /api/health...');
    const healthRes = await fetch(`http://127.0.0.1:${PORT}/api/health`);
    const health = await healthRes.json();
    console.log('Health status:', health.status, '| Database:', health.database);
    if (health.status !== 'healthy') throw new Error('Health check failed');
    console.log('✓ PASS: Health check endpoint working.');

    // 2. Jobs list
    console.log('\n[TEST 2] Testing GET /api/jobs...');
    const jobsRes = await fetch(`http://127.0.0.1:${PORT}/api/jobs`);
    const jobs = await jobsRes.json();
    console.log('Total jobs returned:', jobs.count);
    if (!jobs.success || jobs.count < 20) throw new Error(`Expected at least 20 jobs, got ${jobs.count}`);
    console.log('✓ PASS: All 20 Cynbit job openings successfully loaded.');

    // 3. Single job detail
    console.log('\n[TEST 3] Testing GET /api/jobs/full-stack-developer-intern...');
    const singleRes = await fetch(`http://127.0.0.1:${PORT}/api/jobs/full-stack-developer-intern`);
    const single = await singleRes.json();
    console.log('Found role:', single.data.title, '| Department:', single.data.department);
    if (!single.success || single.data.slug !== 'full-stack-developer-intern') throw new Error('Job lookup failed');
    console.log('✓ PASS: Job detail lookup by slug working.');

    // 4. Submit application with resume file
    console.log('\n[TEST 4] Testing POST /api/applications (with resume upload)...');
    const formData = new FormData();
    formData.append('jobId', single.data.id.toString());
    formData.append('fullName', 'Kavya Singhal');
    formData.append('email', 'kavya.singhal@test.edu');
    formData.append('phone', '+91 99887 76655');
    formData.append('university', 'MNIT Jaipur');
    formData.append('degree', 'B.Tech');
    formData.append('specialization', 'Computer Science');
    formData.append('graduationYear', '2026');
    formData.append('gradeType', 'CGPA');
    formData.append('gradeValue', '9.25');
    formData.append('skills', 'React, Node.js, Express, PostgreSQL, Tailwind');
    formData.append('coverLetter', 'Excited to demonstrate practical full-stack capabilities with clean architecture.');

    const samplePdfPath = path.resolve(__dirname, '../uploads/sample_resume.pdf');
    const pdfBuffer = fs.readFileSync(samplePdfPath);
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    formData.append('resume', blob, 'Kavya_Singhal_Resume.pdf');

    const submitRes = await fetch(`http://127.0.0.1:${PORT}/api/applications`, {
      method: 'POST',
      body: formData
    });
    const submit = await submitRes.json();
    console.log('Application response:', submit);
    if (!submit.success || !submit.data.applicationNumber) throw new Error('Application submission failed');
    const appNumber = submit.data.applicationNumber;
    console.log(`✓ PASS: Candidate application submitted. Assigned Code: ${appNumber}`);

    // 5. Track newly created application
    console.log(`\n[TEST 5] Testing GET /api/applications/track?applicationNumber=${appNumber}...`);
    const trackRes = await fetch(`http://127.0.0.1:${PORT}/api/applications/track?applicationNumber=${appNumber}`);
    const track = await trackRes.json();
    console.log('Tracked candidate:', track.data.full_name, '| Current status:', track.data.status);
    console.log('Timeline events count:', track.data.timeline.length);
    if (!track.success || track.data.application_number !== appNumber) throw new Error('Tracking lookup failed');
    console.log('✓ PASS: Candidate live tracking working.');

    // 6. Recruiter applications list
    console.log('\n[TEST 6] Testing GET /api/applications/admin/list...');
    const adminRes = await fetch(`http://127.0.0.1:${PORT}/api/applications/admin/list`, {
      headers: { 'x-recruiter-key': 'cynbit_lead_architect_2026' }
    });
    const admin = await adminRes.json();
    console.log('Recruiter pipeline count:', admin.data.length, '| Metrics:', admin.metrics);
    if (!admin.success || admin.data.length < 4) throw new Error('Recruiter list failed');
    console.log('✓ PASS: Recruiter pipeline list working.');

    // 7. Advance candidate stage
    console.log('\n[TEST 7] Testing PATCH /api/applications/admin/:id/status (advancing to "assessment")...');
    const candidateAppId = track.data.id;
    const patchRes = await fetch(`http://127.0.0.1:${PORT}/api/applications/admin/${candidateAppId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-recruiter-key': 'cynbit_lead_architect_2026'
      },
      body: JSON.stringify({
        status: 'assessment',
        internalNotes: 'Strong React & Node foundation. Assigned BitElevate full-stack challenge.',
        timelineTitle: 'Technical Coding Assessment Assigned',
        timelineDesc: 'BitElevate Full Stack challenge link sent to candidate.'
      })
    });
    const patch = await patchRes.json();
    console.log('Status update response:', patch);
    if (!patch.success) throw new Error('Status update failed');
    console.log('✓ PASS: Application stage advanced.');

    // 8. Verify timeline updated for candidate
    console.log('\n[TEST 8] Verifying candidate timeline reflects new assessment stage...');
    const reTrackRes = await fetch(`http://127.0.0.1:${PORT}/api/applications/track?applicationNumber=${appNumber}`);
    const reTrack = await reTrackRes.json();
    console.log('New candidate status:', reTrack.data.status);
    console.log('Updated timeline events:');
    reTrack.data.timeline.forEach(t => console.log(` - [${t.stage.toUpperCase()}] ${t.title}: ${t.description}`));
    if (reTrack.data.status !== 'assessment' || reTrack.data.timeline.length !== 2) {
      throw new Error('Timeline did not reflect new stage');
    }
    console.log('✓ PASS: Candidate timeline updated in real-time.');

    console.log(`\n==============================================`);
    console.log(`      ALL 8 ENDPOINT TESTS PASSED (100%)       `);
    console.log(`==============================================\n`);

    serverInstance.close();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ TEST FAILURE:', err);
    serverInstance.close();
    process.exit(1);
  }
}

runTests();
