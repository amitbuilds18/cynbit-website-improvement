# Cynbit Technologies — BitElevate Talent & Recruitment Hub

> **Full Stack Developer Internship Assessment**  
> **Original Website:** [https://www.cynbit.in/](https://www.cynbit.in/)  
> **Proposed Solution:** BitElevate & Cynbit Talent Hub — A Full-Stack Recruitment, Resume Processing & Candidate Application Tracking Ecosystem  
> **Stack:** React.js, Tailwind CSS, Node.js, Express.js, PostgreSQL (Neon Cloud)  

---

## 📌 Project Overview

This project was developed as a technical assessment for the **Full Stack Developer Internship at Cynbit Technologies**. 

Following a comprehensive audit of the production Cynbit website (documented in [`WEBSITE_AUDIT.md`](./WEBSITE_AUDIT.md)), we identified critical operational and UX bottlenecks in Cynbit’s talent acquisition funnel:
1. **Misleading Navigation:** The primary header CTA button **"Join Us"** failed to lead to careers or BitElevate, instead executing `onClick: () => a(!0)` in `chunks/layout-db39ce8334f77a17.js` to pop up an email newsletter modal.
2. **High-Friction Application Form:** On `/careers/[slug]`, applicants faced a 25-field monolithic wall of inputs with mandatory duplicate phone numbers and rigid CGPA constraints.
3. **No Direct Resume Upload:** Candidates were forced to paste public Google Drive URLs (`<input type="url" />`), leading to inaccessible CVs whenever permissions were private.
4. **No Candidate Tracking or Recruiter Workflow:** Candidates had no dashboard to track their hiring progress, and recruiters lacked an administrative pipeline.

To solve these problems, we architected and implemented the **BitElevate Talent & Recruitment Hub** — a production-grade full-stack platform featuring:
* **Interactive Job Explorer:** Browse, filter, and search across all 20 real Cynbit openings (12 internships, 8 full-time positions).
* **4-Step Progressive Application Wizard:** Eliminates cognitive overload with clear progressive disclosure and flexible scoring (CGPA or Percentage).
* **Direct File Upload with Validation:** Drag-and-drop PDF/DOCX resume uploading via Multer with client-side preview.
* **Live Candidate Tracking Dashboard:** Candidates track their application status (`CYN-2026-XXXX`) with a real-time milestone stepper and stage notes.
* **Recruiter Pipeline & Review Kanban:** HR and engineering leads can inspect applicants, preview resumes, add internal review notes, and advance candidate stages with instant synchronization.
* **PostgreSQL (Neon Cloud):** Relational schema supporting Neon cloud connection pooling with automatic schema migrations and offline resilience.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | **React.js (v18)** | Component-driven Single Page Application |
| **Styling** | **Tailwind CSS** | Cynbit dark/teal brand theme (`#070b12`, `#006067`, `#00e5ff`) |
| **Routing** | **React Router DOM (v6)** | Client-side routing with clean navigation and deep linking |
| **Icons** | **Lucide React** | Clean, accessible iconography without ligature vocalization bugs |
| **Backend** | **Node.js & Express.js** | RESTful API server with modular controllers and middleware |
| **File Handling** | **Multer** | Multipart form-data parser with disk storage and mime validation |
| **Database** | **PostgreSQL on Neon** | Relational cloud database with SSL connection pooling (`pg`) |
| **Security** | **Helmet & CORS** | HTTP security headers, CORS origin protection, input sanitization |

---

## 🏗️ Architecture & Database Schema

```
┌────────────────────────────────────────────────────────┐
│                   FRONTEND (React.js)                  │
│  - Job Catalog & Search (20 Cynbit Positions)          │
│  - 4-Step Application Wizard + Resume Uploader         │
│  - Live Candidate Tracking Dashboard                   │
│  - Recruiter Kanban & Applicant Review Panel           │
└───────────────────────────┬────────────────────────────┘
                            │ REST APIs (JSON / FormData)
┌───────────────────────────▼────────────────────────────┐
│                  BACKEND (Node.js & Express)           │
│  - Modular Routers: /api/jobs, /api/applications       │
│  - Multer upload middleware (PDF/DOCX, 8MB max)        │
│  - Server-side validation & error handling             │
└───────────────────────────┬────────────────────────────┘
                            │ SSL Connection Pool
┌───────────────────────────▼────────────────────────────┐
│              DATABASE (PostgreSQL on Neon)             │
│  - Tables: jobs, candidates, applications,             │
│    application_timeline                                │
└────────────────────────────────────────────────────────┘
```

### PostgreSQL Tables:
* **`jobs`**: `id`, `slug`, `title`, `department`, `type`, `location`, `description`, `requirements`, `responsibilities`, `tags`, `is_active`, `created_at`
* **`candidates`**: `id`, `full_name`, `email`, `phone`, `linkedin_url`, `github_url`, `portfolio_url`, `university`, `degree`, `specialization`, `graduation_year`, `grade_type`, `grade_value`, `skills`, `created_at`
* **`applications`**: `id`, `application_number` (`CYN-2026-XXXX`), `job_id`, `candidate_id`, `status` (`applied`, `reviewing`, `assessment`, `interview`, `offered`, `rejected`), `cover_letter`, `resume_original_name`, `resume_filename`, `resume_path`, `internal_notes`, `score`, `created_at`, `updated_at`
* **`application_timeline`**: `id`, `application_id`, `stage`, `title`, `description`, `created_at`

---

## 🚀 Quick Start & Local Setup

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/cynbit-website-improvement.git
cd cynbit-website-improvement
```

### 2. Configure Environment Variables
In `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
RECRUITER_SECRET_KEY=cynbit_lead_architect_2026

# Neon PostgreSQL Connection String
# Example: postgresql://username:password@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
DATABASE_URL=your_neon_connection_string_here
```
> **Note:** If `DATABASE_URL` is omitted, the server automatically starts with an embedded In-Memory Relational Engine using the exact same PostgreSQL query interface. This allows immediate testing even before provisioning a Neon database!

### 3. Install Dependencies
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 4. Run the Application
In terminal 1 (start backend API server):
```bash
cd server
npm start
# Server runs on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

In terminal 2 (start frontend development server):
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🧪 Automated Testing

A comprehensive integration test suite verifies all 8 API endpoints, database seeding, resume upload, live tracking, and recruiter stage updates:

```bash
node server/test/test_api.js
```

### Test Suite Execution Output:
```
==============================================
     RUNNING AUTOMATED ENDPOINT TESTS         
==============================================
[TEST 1] Testing GET /api/health...
✓ PASS: Health check endpoint working.

[TEST 2] Testing GET /api/jobs...
✓ PASS: All 20 Cynbit job openings successfully loaded.

[TEST 3] Testing GET /api/jobs/full-stack-developer-intern...
✓ PASS: Job detail lookup by slug working.

[TEST 4] Testing POST /api/applications (with resume upload)...
✓ PASS: Candidate application submitted. Assigned Code: CYN-2026-XXXX

[TEST 5] Testing GET /api/applications/track...
✓ PASS: Candidate live tracking working.

[TEST 6] Testing GET /api/applications/admin/list...
✓ PASS: Recruiter pipeline list working.

[TEST 7] Testing PATCH /api/applications/admin/:id/status...
✓ PASS: Application stage advanced to "assessment".

[TEST 8] Verifying candidate timeline reflects new assessment stage...
✓ PASS: Candidate timeline updated in real-time.
==============================================
      ALL 8 ENDPOINT TESTS PASSED (100%)       
==============================================
```

---

## 🔑 Recruiter Demo Access

To test the **Recruiter Control Hub** (`/recruiter`):
* Navigate to: [http://localhost:5173/recruiter](http://localhost:5173/recruiter)
* Pre-loaded candidates available for immediate review:
  * **Aarav Sharma** (`CYN-2026-0101`) — Full Stack Developer Intern
  * **Priya Patel** (`CYN-2026-0102`) — AI/ML Engineer Intern
  * **Rohan Verma** (`CYN-2026-0103`) — UI/UX Design Intern
* Try selecting a candidate, previewing their resume PDF, adding evaluation notes, and advancing their status from **Screening** to **Assessment** or **Interview**. Then verify that the candidate's tracking view updates immediately on `/track`!

---

## 📄 License & Attribution

Developed for the **Cynbit Technologies Full Stack Developer Internship Assessment**.  
All rights to original trademarks and brand assets belong to **Cynbit Technologies Private Limited**.
