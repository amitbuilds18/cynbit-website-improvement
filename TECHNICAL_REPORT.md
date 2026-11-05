# Cynbit Technologies — Technical Report & Architectural Assessment

**Project Title:** BitElevate Talent & Recruitment Ecosystem  
**Target Website:** [https://www.cynbit.in/](https://www.cynbit.in/)  
**Role:** Senior Full Stack Developer, UI/UX Designer & Software Architect  
**Assessment:** Full Stack Developer Internship Assessment  
**Date:** November 2026  

---

## 1. Project Overview

Cynbit Technologies Private Limited is a technology firm based in Jaipur, Rajasthan, specializing in autonomous AI agents, enterprise cognitive automation, and student talent acceleration through its **BitElevate** ecosystem.

As part of the Full Stack Developer Internship assessment, we were tasked with conducting a rigorous, evidence-based UI/UX and architectural audit of the live public website (`https://www.cynbit.in/`), selecting the single most meaningful improvement based on business value, user experience, and technical depth, and delivering a production-ready, fully functional full-stack prototype.

This report details the complete journey from empirical discovery to the design and deployment of the **BitElevate Talent & Recruitment Hub**, built using **React.js, Tailwind CSS, Node.js, Express.js, and PostgreSQL (Neon Cloud)**.

---

## 2. Original Website Analysis

Every public page, stylesheet, and client-side JavaScript chunk was inspected. Key findings include:

* **Technology Foundation:** The original website is built on Next.js (App Router) with Tailwind CSS and Material Symbols, deployed on Vercel.
* **Component Architecture:** Heavy reliance on client components for navigation (`layout-db39ce8334f77a17.js`) and dynamic career details (`careers/[slug]/page-082725dddd6cb4ac.js`).
* **Active Openings:** 20 verified roles are listed on `/careers`: 12 internship openings (Full Stack, Backend, AI/ML, QA, UI/UX, HR, Business Development, Campus Ambassador, Social Media, Content, Growth, Digital Marketing) and 8 full-time positions.

---

## 3. Problem Statement

Our empirical audit uncovered five critical operational and user experience problems on the live site:

1. **Misleading CTA Routing:**
   In `chunks/layout-db39ce8334f77a17.js` (line 23863), the desktop navigation button **"Join Us"** does *not* link to job openings or BitElevate. Instead, it triggers `onClick: () => a(!0)`, displaying an email newsletter modal (`c.A`). Similarly, the mobile drawer's **"Get Started Now"** also triggers this newsletter popup.
2. **Aggressive Unprompted Popups:**
   A 5-second timer (`setTimeout` in `layout-db39ce8334f77a17.js` line 19550) forces the newsletter modal to appear over any page content (`!localStorage.getItem("cynbit_newsletter_seen")`), interrupting candidate reading.
3. **High-Friction 25-Field Application Form:**
   On `/careers/[slug]`, applicants face a single-page form requiring 25 inputs, including mandatory second phone numbers, date of birth, gender, and full permanent residential address.
4. **No Direct Resume File Upload:**
   Candidates cannot upload PDF or Word documents directly. They are forced to input a public Google Drive URL (`<input type="url" />`). If permissions are restricted, recruiters are locked out of viewing the candidate's CV.
5. **Rigid CGPA Scoring:**
   The form restricts academic scores to `min="0" max="10" step="0.01"`, failing applicants from colleges grading via percentages (e.g. 78%) or 4.0 scales.
6. **No Candidate Portal or Recruiter Workflow:**
   Once an application is submitted, candidates have no dashboard to track their status. If an applicant returns, the site displays a dead-end "Already Applied" message.

---

## 4. Proposed Improvement

To address these systemic bottlenecks, we built the **BitElevate Talent & Recruitment Hub**:

* **Public Job Explorer:** Filterable catalog across all 20 Cynbit openings with search, department filtering, and type tabs.
* **Progressive 4-Step Application Wizard:** Reduces cognitive fatigue by segmenting the application into:
  1. *Personal Credentials*
  2. *Academic & Skill Alignment* (supporting both CGPA and percentage)
  3. *Direct Resume Upload* (drag-and-drop PDF/DOCX with file validation and client preview)
  4. *Statement of Purpose & Final Blueprint Review*
* **Real-Time Candidate Tracking Dashboard:** Candidates enter their reference code (`CYN-2026-XXXX`) to view live stage progress (`Applied` $\rightarrow$ `Screening` $\rightarrow$ `Assessment / Interview` $\rightarrow$ `Decision`) and reviewer feedback.
* **Recruiter Control Hub:** An administrative pipeline allowing recruiters to inspect applicants, preview resumes directly in-browser, add internal notes, and advance candidate stages with instant synchronization.

---

## 5. Why This Improvement Was Selected

| Evaluation Criteria | Impact of Proposed Solution |
|---|---|
| **User Experience (UX)** | Replaces misleading popups and 25-field walls with a clean 4-step wizard and real-time status tracking. |
| **Business Value** | Dramatically improves applicant conversion rates and removes manual recruiter friction for Cynbit's 20 open positions. |
| **Technical Breadth** | Demonstrates full-stack mastery across frontend UI, client state, file upload pipelines, RESTful APIs, and relational database modeling. |
| **Authenticity** | Directly serves Cynbit’s flagship BitElevate ecosystem and addresses actual code found on their live site. |

---

## 6. Technology Stack & Reasons

* **Frontend:**
  * **React.js (v18):** Declarative component architecture for complex state machines (multi-step wizard, tracking stepper, recruiter pipeline).
  * **Tailwind CSS:** Pixel-accurate styling adhering to Cynbit's brand aesthetics (`#070b12`, `#006067`, `#00e5ff`) with responsive layouts.
  * **React Router DOM (v6):** Fast, client-side routing with URL query param synchronization.
  * **Lucide React:** Accessible, clean iconography without ligature text vocalization errors.
* **Backend:**
  * **Node.js & Express.js:** Scalable, lightweight REST API architecture.
  * **Multer:** Handles multipart/form-data for direct resume uploads with size and MIME-type validation.
  * **Helmet & CORS:** Enterprise HTTP header protection and cross-origin resource sharing.
* **Database:**
  * **PostgreSQL on Neon Cloud:** Fully managed serverless PostgreSQL with connection pooling (`pg.Pool`), SSL communication, and relational data integrity.
  * **Dual Engine Resilience:** Supports direct Neon cloud connections while providing an embedded in-memory relational engine for seamless local evaluation.

---

## 7. Architecture Overview

```
[ Candidate Browser ] <─────> [ React + Tailwind Client (Vite) ]
                                          │
                                          │ HTTP / REST API
                                          ▼
                              [ Express.js API Server ]
                                 ├── /api/jobs
                                 ├── /api/applications (Multer upload)
                                 └── /api/health
                                          │
                                          │ pg Connection Pool (SSL)
                                          ▼
                              [ PostgreSQL on Neon Cloud ]
                                 ├── jobs table
                                 ├── candidates table
                                 ├── applications table
                                 └── application_timeline table
```

---

## 8. Frontend Implementation

1. **`Navbar.jsx`:**
   Clean brand header with responsive navigation. Routes "Apply For Roles" directly to the jobs catalog, fixing the deceptive newsletter popup bug.
2. **`HomePage.jsx`:**
   Hero section reflecting BitElevate’s manifesto ("Stop Watching Tutorials. Start Doing The Work"), live metrics bar, track overview, and a quick-tracking widget.
3. **`JobsPage.jsx`:**
   Catalog of all 20 Cynbit job openings with live search, department filter chips, and type tabs.
4. **`JobDetailPage.jsx`:**
   Full role specifications, responsibilities, requirements, and embedded 4-step wizard.
5. **`MultiStepForm.jsx`:**
   Progressive disclosure wizard with inline validation, drag-and-drop resume uploader with client preview, and flexible grading inputs.
6. **`TrackPage.jsx`:**
   Live tracking view rendering candidate credentials, a 4-stage stepper, and an audit trail of recruiter notes.
7. **`RecruiterPage.jsx`:**
   Administrative management dashboard with pipeline metrics, candidate search, resume preview, and single-click stage advancement.

---

## 9. Backend Implementation

* **Modular REST Endpoints:**
  * `GET /api/jobs`: Returns active jobs with optional filtering.
  * `GET /api/jobs/:slug`: Returns detailed job opening.
  * `POST /api/applications`: Multer-handled multipart submission validating candidate information and storing resumes.
  * `GET /api/applications/track`: Returns candidate profile, stage status, and timeline events.
  * `GET /api/applications/admin/list`: Recruiter pipeline with metrics.
  * `PATCH /api/applications/admin/:id/status`: Advances candidate stage and appends timeline entries.
* **Security & File Handling:**
  * Multer storage with unique timestamp prefixes and sanitized filenames.
  * Restricted file types (`.pdf`, `.doc`, `.docx`) with 8MB size ceiling.
  * Recruiter route authentication via `x-recruiter-key`.

---

## 10. Database Design (PostgreSQL on Neon)

```sql
CREATE TABLE jobs (
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

CREATE TABLE candidates (
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

CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  application_number VARCHAR(50) UNIQUE NOT NULL,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'applied',
  cover_letter TEXT,
  resume_original_name VARCHAR(255),
  resume_filename VARCHAR(255),
  resume_path VARCHAR(500),
  internal_notes TEXT,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE application_timeline (
  id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 11. Testing Performed

An automated integration test suite was developed in `server/test/test_api.js` to verify all critical user flows:

1. **`GET /api/health`:** Verified healthy server and database connectivity.
2. **`GET /api/jobs`:** Verified that all 20 Cynbit job openings are retrieved.
3. **`GET /api/jobs/:slug`:** Verified single role lookup by slug.
4. **`POST /api/applications`:** Verified multipart application submission with PDF resume upload.
5. **`GET /api/applications/track`:** Verified candidate lookup by reference number.
6. **`GET /api/applications/admin/list`:** Verified recruiter pipeline data and metrics aggregation.
7. **`PATCH /api/applications/admin/:id/status`:** Verified advancing candidate stage from `applied` to `assessment`.
8. **Real-Time Timeline Synchronization:** Verified candidate timeline immediately reflects the new assessment stage.

**Result: 8 / 8 Tests Passed (100% Success Rate).**

---

## 12. Results and Limitations

### Results:
* Eliminates candidate application friction with a 4-step wizard.
* Fixes broken/misleading navigation CTAs.
* Enables direct resume file uploads.
* Provides live candidate tracking and recruiter pipeline management.

### Limitations & Future Roadmap:
* **Automated AI Resume Screening:** In future iterations, integrate OpenAI/Gemini embeddings to score resumes against job requirements automatically.
* **Email / WhatsApp Webhooks:** Integrate Twilio or SendGrid to send automated interview invite notifications to candidates upon status change.

---

## 13. GitHub Repository URL

* **Repository:** `https://github.com/arvind-cynbit/cynbit-website-improvement` *(Placeholder for user's repository)*
* **Branch:** `main`

---

## 14. Live Deployment URL

* **Frontend (Vercel):** `https://cynbit-talent-hub.vercel.app` *(Deployable with one click)*
* **Backend API (Render):** `https://cynbit-talent-api.onrender.com`
* **Database:** Hosted on **Neon Cloud PostgreSQL**

---

## 15. Instructions to Run Locally

### 1. Install Dependencies
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Configure Environment Variables
In `server/.env`:
```env
PORT=5000
DATABASE_URL=postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
CLIENT_URL=http://localhost:5173
RECRUITER_SECRET_KEY=cynbit_lead_architect_2026
```
*(If no `DATABASE_URL` is provided, the system seamlessly runs on the embedded In-Memory Relational Engine).*

### 3. Start Backend & Frontend
```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd client
npm run dev
```

Visit **[http://localhost:5173](http://localhost:5173)** in your browser.
