const db = require('../config/db');

const initialJobs = [
  // 12 INTERNSHIP ROLES (from live cynbit.in/careers)
  {
    slug: 'full-stack-developer-intern',
    title: 'Full Stack Developer Intern',
    department: 'Engineering',
    type: 'Internship',
    location: 'Remote / Jaipur, India',
    description: 'Build enterprise-grade web applications, responsive user interfaces, and scalable REST/GraphQL APIs across React, Node.js, Express, and PostgreSQL/MongoDB.',
    requirements: [
      'Proficiency in JavaScript (ES6+), React.js, and Node.js',
      'Knowledge of relational and NoSQL databases (PostgreSQL, MongoDB)',
      'Understanding of RESTful API principles and state management',
      'Familiarity with Git, GitHub, and deployment workflows'
    ],
    responsibilities: [
      'Develop dynamic, accessible frontend interfaces with Tailwind CSS',
      'Construct secure backend services and database models',
      'Collaborate on sprint planning and daily code reviews',
      'Participate in architectural reviews and performance optimizations'
    ],
    tags: ['React', 'Node.js', 'PostgreSQL', 'Express', 'Tailwind CSS']
  },
  {
    slug: 'backend-developer-intern',
    title: 'Backend Developer Intern',
    department: 'Engineering',
    type: 'Internship',
    location: 'Remote / Jaipur, India',
    description: 'Design robust microservices, database schemas, and secure authentication systems powering Cynbit SaaS and client platforms.',
    requirements: [
      'Strong grasp of Node.js, Express, and database indexing',
      'Familiarity with SQL (PostgreSQL) and schema migrations',
      'Knowledge of API authentication (JWT, OAuth) and rate limiting'
    ],
    responsibilities: [
      'Architect resilient API endpoints and data validation pipelines',
      'Optimize database queries and background job queues'
    ],
    tags: ['Node.js', 'PostgreSQL', 'Express', 'REST API', 'Redis']
  },
  {
    slug: 'ai-ml-engineer-intern',
    title: 'AI/ML Engineer Intern',
    department: 'AI & Data Science',
    type: 'Internship',
    location: 'Remote / Jaipur, India',
    description: 'Work alongside architects on autonomous AI agents, LLM pipelines, and cognitive business automation systems.',
    requirements: [
      'Python proficiency with PyTorch, TensorFlow, or LangChain',
      'Experience with RESTful API integration and prompt engineering',
      'Understanding of embeddings, vector databases, and retrieval (RAG)'
    ],
    responsibilities: [
      'Prototype autonomous agent reasoning loops and cognitive toolkits',
      'Evaluate model hallucination rates and response accuracy'
    ],
    tags: ['Python', 'LangChain', 'OpenAI', 'RAG', 'Vector DB']
  },
  {
    slug: 'ui-ux-design-intern',
    title: 'UI/UX Design Intern',
    department: 'Design',
    type: 'Internship',
    location: 'Remote / Jaipur, India',
    description: 'Craft human-centric digital interfaces, interactive wireframes, and design system components for web and mobile products.',
    requirements: [
      'Proficiency in Figma and component-driven design systems',
      'Strong understanding of WCAG accessibility standards and micro-interactions',
      'Portfolio showcasing mobile-responsive web concepts'
    ],
    responsibilities: [
      'Create high-fidelity mockups, design tokens, and user journey maps',
      'Conduct usability audits and collaborate with frontend developers'
    ],
    tags: ['Figma', 'UI/UX', 'Design Systems', 'Wireframing', 'Accessibility']
  },
  {
    slug: 'qa-testing-intern',
    title: 'QA Testing Intern',
    department: 'Engineering',
    type: 'Internship',
    location: 'Remote / Jaipur, India',
    description: 'Ensure rock-solid software quality through automated end-to-end testing, integration tests, and performance stress benchmarks.',
    requirements: [
      'Knowledge of automated testing frameworks (Playwright, Cypress, Jest)',
      'Understanding of HTTP status codes, API validation, and regression suites',
      'Attention to edge cases and UI responsiveness'
    ],
    responsibilities: [
      'Write comprehensive unit and integration test suites',
      'Identify visual regressions and verify API payloads'
    ],
    tags: ['Jest', 'Playwright', 'API Testing', 'Cypress', 'QA']
  },
  {
    slug: 'hr-talent-acquisition-intern',
    title: 'HR & Talent Acquisition Intern',
    department: 'People Operations',
    type: 'Internship',
    location: 'Remote / Jaipur, India',
    description: 'Drive BitElevate recruitment pipelines, candidate engagement, and modern onboarding processes.',
    requirements: ['Excellent communication', 'Organizational rigor', 'Interest in tech hiring'],
    responsibilities: ['Screen candidate profiles', 'Coordinate technical assessments and interview rounds'],
    tags: ['Recruitment', 'People Ops', 'Talent Acquisition']
  },
  {
    slug: 'business-development-intern',
    title: 'Business Development Intern',
    department: 'Growth',
    type: 'Internship',
    location: 'Remote / Jaipur, India',
    description: 'Identify enterprise client opportunities and strategic industry partnerships for AI and software engineering services.',
    requirements: ['Market research skills', 'Strategic outreach', 'Presentation abilities'],
    responsibilities: ['Map prospective B2B technology buyers', 'Assist in RFP drafting and client pitches'],
    tags: ['B2B Sales', 'Market Research', 'Partnerships']
  },
  {
    slug: 'campus-ambassador-campus-relations-intern',
    title: 'Campus Ambassador / Campus Relations Intern',
    department: 'BitElevate',
    type: 'Internship',
    location: 'Remote / Jaipur, India',
    description: 'Connect university engineering student communities with the BitElevate ecosystem and hackathons.',
    requirements: ['Active campus presence', 'Leadership and networking abilities'],
    responsibilities: ['Host technical webinars and showcase BitElevate real-world tracks'],
    tags: ['Campus Outreach', 'Community', 'Student Leadership']
  },
  {
    slug: 'social-media-brand-intern',
    title: 'Social Media & Brand Intern',
    department: 'Marketing',
    type: 'Internship',
    location: 'Remote / Jaipur, India',
    description: 'Amplify Cynbit’s engineering story and BitElevate student milestones across LinkedIn, X, and Instagram.',
    requirements: ['Content creation', 'Visual storytelling', 'Copywriting flair'],
    responsibilities: ['Publish weekly technical carousels and student spotlight diaries'],
    tags: ['Branding', 'LinkedIn', 'Social Media']
  },
  {
    slug: 'content-marketing-intern',
    title: 'Content Marketing Intern',
    department: 'Marketing',
    type: 'Internship',
    location: 'Remote / Jaipur, India',
    description: 'Author in-depth technical blogs and case studies on AI automation, web performance, and cloud architecture.',
    requirements: ['Strong technical writing skills', 'SEO familiarity', 'Research capability'],
    responsibilities: ['Write authoritative technical articles for the Cynbit Insights hub'],
    tags: ['Technical Writing', 'SEO', 'Content Strategy']
  },
  {
    slug: 'growth-marketing-intern',
    title: 'Growth Marketing Intern',
    department: 'Marketing',
    type: 'Internship',
    location: 'Remote / Jaipur, India',
    description: 'Experiment with viral growth loops, email outreach, and conversion rate optimization across the Cynbit website.',
    requirements: ['Data-driven mindset', 'Google Analytics / PostHog familiarity'],
    responsibilities: ['Analyze user funnel metrics and launch A/B experiments'],
    tags: ['Growth', 'Analytics', 'Conversion Optimization']
  },
  {
    slug: 'digital-marketing-intern',
    title: 'Digital Marketing Intern',
    department: 'Marketing',
    type: 'Internship',
    location: 'Remote / Jaipur, India',
    description: 'Execute search engine optimization (SEO), performance campaigns, and inbound marketing funnels.',
    requirements: ['Understanding of technical SEO', 'Keyword research', 'Ad platforms'],
    responsibilities: ['Conduct on-page and off-page SEO audits', 'Optimize conversion funnels'],
    tags: ['Technical SEO', 'Performance Marketing', 'Inbound Funnels']
  },

  // 8 FULL-TIME ROLES (from live cynbit.in/careers)
  {
    slug: 'full-stack-developer',
    title: 'Full Stack Developer',
    department: 'Engineering',
    type: 'Full-Time',
    location: 'Jaipur, India / Hybrid',
    description: 'Lead engineering on flagship client products and SaaS platforms. Architect high-performance web systems from database to UI.',
    requirements: [
      '3+ years experience with React, Node.js, Express, and PostgreSQL/MongoDB',
      'Proven track record architecting complex SPAs and cloud-native backends',
      'Solid grasp of CI/CD, Docker, and AWS/Vercel deployments'
    ],
    responsibilities: [
      'Mentor engineering interns and junior developers',
      'Drive system design, code quality standards, and API architecture'
    ],
    tags: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']
  },
  {
    slug: 'backend-developer',
    title: 'Backend Developer',
    department: 'Engineering',
    type: 'Full-Time',
    location: 'Jaipur, India / Hybrid',
    description: 'Senior backend architect responsible for high-throughput distributed microservices, message queues, and database partitioning.',
    requirements: ['3+ years in Node.js/Go', 'Deep SQL & PostgreSQL mastery', 'System architecture experience'],
    responsibilities: ['Own API contracts, database optimizations, and system resilience'],
    tags: ['Node.js', 'PostgreSQL', 'Microservices', 'Distributed Systems']
  },
  {
    slug: 'ai-engineer',
    title: 'AI Engineer',
    department: 'AI & Data Science',
    type: 'Full-Time',
    location: 'Jaipur, India / Hybrid',
    description: 'Lead research and deployment of autonomous AI agent teams, multi-agent frameworks, and enterprise cognitive automation.',
    requirements: ['Strong Python', 'Vector databases, RAG architecture, agentic orchestration', 'Production deployment of LLMs'],
    responsibilities: ['Design and deploy domain-specific AI agents for enterprise clients'],
    tags: ['Autonomous Agents', 'Python', 'LangChain', 'LlamaIndex', 'RAG']
  },
  {
    slug: 'devops-cloud-engineer',
    title: 'DevOps / Cloud Engineer',
    department: 'Engineering',
    type: 'Full-Time',
    location: 'Jaipur, India / Hybrid',
    description: 'Architect resilient cloud infrastructure, automated Kubernetes deployments, and zero-downtime CI/CD pipelines.',
    requirements: ['Experience with AWS, Docker, Terraform, and GitHub Actions', 'Monitoring and observability mastery'],
    responsibilities: ['Manage cloud security, scalability, and infrastructure as code'],
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform']
  },
  {
    slug: 'business-development-executive',
    title: 'Business Development Executive',
    department: 'Growth',
    type: 'Full-Time',
    location: 'Jaipur, India / Hybrid',
    description: 'Drive high-value enterprise technology contracts, client relationships, and business revenue.',
    requirements: ['Demonstrated tech sales success', 'Relationship building', 'Contract negotiation'],
    responsibilities: ['Lead enterprise sales cycles from discovery to closing'],
    tags: ['B2B Sales', 'Enterprise', 'Revenue Growth']
  },
  {
    slug: 'content-strategist',
    title: 'Content Strategist',
    department: 'Marketing',
    type: 'Full-Time',
    location: 'Jaipur, India / Hybrid',
    description: 'Formulate global content strategy, brand voice, and engineering thought-leadership publications.',
    requirements: ['Deep editorial experience in technology', 'Brand narrative design'],
    responsibilities: ['Oversee all technical publications, whitepapers, and brand messaging'],
    tags: ['Brand Voice', 'Content Strategy', 'Thought Leadership']
  },
  {
    slug: 'growth-manager',
    title: 'Growth Manager',
    department: 'Growth',
    type: 'Full-Time',
    location: 'Jaipur, India / Hybrid',
    description: 'Lead multi-channel growth marketing, enterprise inbound strategies, and SaaS acquisition metrics.',
    requirements: ['Growth marketing background', 'Metrics-driven', 'Conversion funnel optimization'],
    responsibilities: ['Own revenue funnel growth and student ecosystem expansion'],
    tags: ['Growth', 'Funnel Optimization', 'Leadership']
  },
  {
    slug: 'marketing-executive',
    title: 'Marketing Executive',
    department: 'Marketing',
    type: 'Full-Time',
    location: 'Jaipur, India / Hybrid',
    description: 'Execute campaigns, PR initiatives, and international digital presence for Cynbit Technologies.',
    requirements: ['Digital marketing execution', 'Brand management', 'Campaign analytics'],
    responsibilities: ['Manage omni-channel campaigns and client testimonial storytelling'],
    tags: ['Campaigns', 'PR', 'Digital Marketing']
  }
];

// Sample seed candidates and applications for immediate demonstration
const sampleApplications = [
  {
    candidate: {
      full_name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      phone: '+91 98765 43210',
      linkedin_url: 'https://linkedin.com/in/aarav-sharma-dev',
      github_url: 'https://github.com/aarav-sharma',
      portfolio_url: 'https://aaravsharma.dev',
      university: 'Malaviya National Institute of Technology (MNIT Jaipur)',
      degree: 'B.Tech',
      specialization: 'Computer Science & Engineering',
      graduation_year: '2026',
      grade_type: 'CGPA',
      grade_value: 8.85,
      skills: ['React.js', 'Node.js', 'PostgreSQL', 'Express', 'Tailwind CSS', 'Git']
    },
    job_slug: 'full-stack-developer-intern',
    status: 'assessment',
    cover_letter: 'Passionate about building scalable web applications. Have built full-stack MERN and PERN projects including a collaborative workspace and real-time dashboard.',
    score: 92,
    timeline: [
      { stage: 'applied', title: 'Application Submitted', description: 'Application blueprint received with verified GitHub profile.' },
      { stage: 'reviewing', title: 'Technical Screening Passed', description: 'Strong portfolio projects in React and Node.js. Verified clean code standards.' },
      { stage: 'assessment', title: 'Coding Assessment Assigned', description: 'Technical assessment task issued: BitElevate Real-Time Application Pipeline.' }
    ]
  },
  {
    candidate: {
      full_name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 98234 56789',
      linkedin_url: 'https://linkedin.com/in/priyapatel-ai',
      github_url: 'https://github.com/priyapatel',
      portfolio_url: 'https://priyapatel.ai',
      university: 'BITS Pilani',
      degree: 'B.E.',
      specialization: 'Artificial Intelligence & Data Science',
      graduation_year: '2025',
      grade_type: 'CGPA',
      grade_value: 9.10,
      skills: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'Vector DB', 'PostgreSQL']
    },
    job_slug: 'ai-ml-engineer-intern',
    status: 'interview',
    cover_letter: 'Experience implementing retrieval-augmented generation (RAG) pipelines and evaluating multi-agent systems for cognitive automation.',
    score: 95,
    timeline: [
      { stage: 'applied', title: 'Application Submitted', description: 'Application received with PyTorch research papers and GitHub links.' },
      { stage: 'reviewing', title: 'Resume Approved', description: 'Outstanding theoretical and practical grasp of RAG architecture.' },
      { stage: 'assessment', title: 'Assessment Cleared', description: 'Scored 96/100 on Agent Reasoning Benchmark.' },
      { stage: 'interview', title: 'Technical Architectural Interview Scheduled', description: 'Meeting scheduled with Chief Architect.' }
    ]
  },
  {
    candidate: {
      full_name: 'Rohan Verma',
      email: 'rohan.verma@example.com',
      phone: '+91 91234 11223',
      linkedin_url: 'https://linkedin.com/in/rohanverma-design',
      github_url: 'https://github.com/rohanverma',
      portfolio_url: 'https://behance.net/rohanverma',
      university: 'Delhi Technological University (DTU)',
      degree: 'B.Des',
      specialization: 'Interaction Design',
      graduation_year: '2026',
      grade_type: 'Percentage',
      grade_value: 84.50,
      skills: ['Figma', 'Design Systems', 'Micro-interactions', 'Prototyping', 'WCAG AA']
    },
    job_slug: 'ui-ux-design-intern',
    status: 'reviewing',
    cover_letter: 'Obsessed with clean, accessible, modern digital architecture. Redesigned SaaS dashboards with high-contrast typography and fluid animations.',
    score: 88,
    timeline: [
      { stage: 'applied', title: 'Application Submitted', description: 'Portfolio submitted featuring 3 comprehensive SaaS design case studies.' },
      { stage: 'reviewing', title: 'Portfolio Under Review', description: 'Design lead evaluating component system and mobile ergonomics.' }
    ]
  }
];

async function seed() {
  console.log('--- Starting Seed Process ---');
  await db.initDatabase();

  const isNeon = db.getIsNeon();

  if (isNeon) {
    console.log('Seeding data into Neon PostgreSQL database...');
    // Seed Jobs into PostgreSQL
    for (const job of initialJobs) {
      await db.query(`
        INSERT INTO jobs (slug, title, department, type, location, description, requirements, responsibilities, tags, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          department = EXCLUDED.department,
          type = EXCLUDED.type,
          description = EXCLUDED.description,
          requirements = EXCLUDED.requirements,
          responsibilities = EXCLUDED.responsibilities,
          tags = EXCLUDED.tags;
      `, [
        job.slug,
        job.title,
        job.department,
        job.type,
        job.location,
        job.description,
        JSON.stringify(job.requirements),
        JSON.stringify(job.responsibilities),
        JSON.stringify(job.tags)
      ]);
    }
    console.log(`Seeded ${initialJobs.length} jobs into PostgreSQL.`);

    // Seed sample candidates & applications if none exist
    const existingApps = await db.query('SELECT COUNT(*) FROM applications');
    if (parseInt(existingApps.rows[0].count, 10) === 0) {
      for (const [idx, sample] of sampleApplications.entries()) {
        const c = sample.candidate;
        const candRes = await db.query(`
          INSERT INTO candidates (full_name, email, phone, linkedin_url, github_url, portfolio_url, university, degree, specialization, graduation_year, grade_type, grade_value, skills)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING id;
        `, [
          c.full_name, c.email, c.phone, c.linkedin_url, c.github_url, c.portfolio_url,
          c.university, c.degree, c.specialization, c.graduation_year, c.grade_type, c.grade_value,
          JSON.stringify(c.skills)
        ]);

        const candidateId = candRes.rows[0].id;
        const jobRes = await db.query('SELECT id FROM jobs WHERE slug = $1', [sample.job_slug]);
        const jobId = jobRes.rows[0].id;
        const appNumber = `CYN-2026-${String(idx + 101).padStart(4, '0')}`;

        const appRes = await db.query(`
          INSERT INTO applications (application_number, job_id, candidate_id, status, cover_letter, score, resume_original_name, resume_filename, resume_path)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id;
        `, [
          appNumber, jobId, candidateId, sample.status, sample.cover_letter, sample.score,
          `${c.full_name.replace(/\s+/g, '_')}_Resume.pdf`,
          `sample_${idx + 1}.pdf`,
          '/uploads/sample_resume.pdf'
        ]);

        const appId = appRes.rows[0].id;
        for (const tl of sample.timeline) {
          await db.query(`
            INSERT INTO application_timeline (application_id, stage, title, description)
            VALUES ($1, $2, $3, $4);
          `, [appId, tl.stage, tl.title, tl.description]);
        }
      }
      console.log(`Seeded ${sampleApplications.length} sample applications with timeline history.`);
    }
  } else {
    console.log('Seeding data into In-Memory store...');
    db.mockStore.jobs = initialJobs.map((j, idx) => ({ id: idx + 1, ...j, is_active: true, created_at: new Date() }));
    
    db.mockStore.candidates = [];
    db.mockStore.applications = [];
    db.mockStore.timeline = [];

    sampleApplications.forEach((sample, idx) => {
      const candidateId = idx + 1;
      const cand = { id: candidateId, ...sample.candidate, created_at: new Date() };
      db.mockStore.candidates.push(cand);

      const job = db.mockStore.jobs.find(j => j.slug === sample.job_slug);
      const appId = idx + 1;
      const appNumber = `CYN-2026-${String(idx + 101).padStart(4, '0')}`;

      const app = {
        id: appId,
        application_number: appNumber,
        job_id: job ? job.id : 1,
        candidate_id: candidateId,
        status: sample.status,
        cover_letter: sample.cover_letter,
        score: sample.score,
        resume_original_name: `${cand.full_name.replace(/\s+/g, '_')}_Resume.pdf`,
        resume_filename: `sample_${idx + 1}.pdf`,
        resume_path: '/uploads/sample_resume.pdf',
        resume_url: null,
        internal_notes: 'Demonstrated high competence during screening.',
        created_at: new Date(Date.now() - (idx * 86400000 * 2)),
        updated_at: new Date()
      };
      db.mockStore.applications.push(app);

      sample.timeline.forEach((tl, tIdx) => {
        db.mockStore.timeline.push({
          id: db.mockStore.timeline.length + 1,
          application_id: appId,
          stage: tl.stage,
          title: tl.title,
          description: tl.description,
          created_at: new Date(Date.now() - (idx * 86400000 * 2) + (tIdx * 3600000 * 4))
        });
      });
    });
    console.log(`Seeded in-memory store with ${initialJobs.length} jobs and ${sampleApplications.length} applications.`);
  }

  console.log('--- Seed Completed Successfully ---');
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}

module.exports = { seed, initialJobs, sampleApplications };
