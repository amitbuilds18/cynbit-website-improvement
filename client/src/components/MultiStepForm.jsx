import React, { useState } from 'react';
import { 
  User, Mail, Phone, Linkedin, Github, Globe, GraduationCap, 
  UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Loader2, X 
} from 'lucide-react';
import { api } from '../services/api';

export default function MultiStepForm({ job, onApplicationSuccess }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    university: '',
    degree: 'B.Tech / B.E.',
    specialization: '',
    graduationYear: '2026',
    gradeType: 'CGPA',
    gradeValue: '',
    skills: '',
    coverLetter: '',
    agreedToTerms: false
  });

  // Resume state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(null);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setResumeError(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    setResumeError(null);
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      setResumeError('Please upload a PDF or Word document (.pdf, .doc, .docx).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setResumeError('File size exceeds the 8MB limit. Please upload a smaller file.');
      return;
    }
    setResumeFile(file);
    setResumeError(null);
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.fullName.trim()) return 'Please enter your full name.';
      if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid email address.';
      if (!formData.phone.trim() || formData.phone.length < 8) return 'Please enter a valid phone number.';
    }
    if (currentStep === 2) {
      if (!formData.university.trim()) return 'Please enter your college or university name.';
      if (!formData.specialization.trim()) return 'Please enter your field of specialization.';
    }
    if (currentStep === 3) {
      if (!resumeFile) return 'Please upload your resume (PDF or DOCX).';
    }
    if (currentStep === 4) {
      if (!formData.agreedToTerms) return 'Please confirm the accuracy of your application details.';
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErr = validateStep(4);
    if (validationErr) {
      setError(validationErr);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('jobId', job.id);
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('linkedinUrl', formData.linkedinUrl);
      data.append('githubUrl', formData.githubUrl);
      data.append('portfolioUrl', formData.portfolioUrl);
      data.append('university', formData.university);
      data.append('degree', formData.degree);
      data.append('specialization', formData.specialization);
      data.append('graduationYear', formData.graduationYear);
      data.append('gradeType', formData.gradeType);
      data.append('gradeValue', formData.gradeValue);
      data.append('skills', formData.skills);
      data.append('coverLetter', formData.coverLetter);

      if (resumeFile) {
        data.append('resume', resumeFile);
      }

      const res = await api.submitApplication(data);

      if (res.success) {
        onApplicationSuccess(res.data);
      } else if (res.isDuplicate) {
        setError(`You have already applied for this role. Your reference code is ${res.applicationNumber}.`);
      } else {
        setError(res.message || 'Submission failed. Please verify your details.');
      }
    } catch (err) {
      setError('Network connection error. Please ensure the backend server is running.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Personal Info' },
    { num: 2, title: 'Education' },
    { num: 3, title: 'Resume Upload' },
    { num: 4, title: 'Review & Submit' }
  ];

  return (
    <div className="bg-[#0d1522] border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      
      {/* Top Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Step {step} of 4: {steps[step - 1].title}
          </span>
          <span className="text-xs text-slate-400">
            Target Role: <strong className="text-white">{job.title}</strong>
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          {steps.map((s) => (
            <div key={s.num} className="space-y-1">
              <div className={`h-1.5 rounded-full transition-all duration-300 ${
                s.num < step 
                  ? 'bg-teal-500' 
                  : s.num === step 
                    ? 'bg-cyan-400 glow-teal-sm' 
                    : 'bg-white/[0.08]'
              }`} />
              <p className={`text-[10px] hidden sm:block ${s.num === step ? 'text-cyan-300 font-bold' : 'text-slate-500'}`}>
                {s.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Wizard Form Steps */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* STEP 1: Personal Credentials */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Alex Rivera"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Phone Number <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <Linkedin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="url"
                    name="linkedinUrl"
                    placeholder="https://linkedin.com/in/alexrivera"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  GitHub Profile
                </label>
                <div className="relative">
                  <Github className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="url"
                    name="githubUrl"
                    placeholder="https://github.com/alexrivera"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Portfolio / Personal Website
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="url"
                    name="portfolioUrl"
                    placeholder="https://alexrivera.dev"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Academic & Skills */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  College / University <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="university"
                    required
                    placeholder="e.g. MNIT Jaipur, BITS, DTU"
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Degree Program <span className="text-cyan-400">*</span>
                </label>
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="B.Sc. / M.Sc.">B.Sc. / M.Sc.</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="Other">Other Degree</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Specialization <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  name="specialization"
                  required
                  placeholder="e.g. Computer Science, AI, IT"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Graduation Year
                </label>
                <select
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  <option value="2027">2027</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="Graduate">Graduated earlier</option>
                </select>
              </div>

              {/* Flexible Grade: CGPA or Percentage (Fixes original hardcoded 10.0 scale limitation) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Grade Score
                  </label>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, gradeType: 'CGPA' }))}
                      className={`px-2 py-0.5 rounded ${formData.gradeType === 'CGPA' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500'}`}
                    >
                      CGPA
                    </button>
                    <span>/</span>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, gradeType: 'Percentage' }))}
                      className={`px-2 py-0.5 rounded ${formData.gradeType === 'Percentage' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500'}`}
                    >
                      %
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={formData.gradeType === 'CGPA' ? '10' : '100'}
                  name="gradeValue"
                  placeholder={formData.gradeType === 'CGPA' ? 'e.g. 8.75' : 'e.g. 82.5'}
                  value={formData.gradeValue}
                  onChange={handleChange}
                  className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Core Skills & Tech Stack (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                placeholder="e.g. React, Node.js, Express, PostgreSQL, Tailwind, Git"
                value={formData.skills}
                onChange={handleChange}
                className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Direct Resume Upload (Fixes original Google Drive URL barrier) */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Direct Resume & CV Upload</h4>
              <p className="text-xs text-slate-400">
                Upload your resume file directly. We accept PDF, DOC, or DOCX formats (up to 8MB). No need to host on Google Drive.
              </p>
            </div>

            {resumeError && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resumeError}</span>
              </div>
            )}

            {!resumeFile ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="border-2 border-dashed border-white/[0.15] hover:border-cyan-400/60 rounded-2xl p-8 sm:p-12 text-center bg-white/[0.02] hover:bg-cyan-950/10 transition-all cursor-pointer group"
                onClick={() => document.getElementById('resume-input').click()}
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-800/40 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-7 h-7 text-cyan-400" />
                </div>
                <h5 className="text-sm font-bold text-white mb-1">
                  Drag & drop your resume here, or <span className="text-cyan-400 underline">browse</span>
                </h5>
                <p className="text-xs text-slate-500">Supports PDF, DOC, DOCX up to 8MB</p>
                <input
                  type="file"
                  id="resume-input"
                  className="hidden"
                  accept=".pdf,.doc,.docx,application/pdf"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <div className="bg-[#070b12] border border-cyan-500/30 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/40 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                      {resumeFile.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Verified
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setResumeFile(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] transition-colors"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Review & Submit */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Statement of Purpose & Final Blueprint Review</h4>
              <p className="text-xs text-slate-400">
                Review your application credentials before submitting to the Cynbit evaluation engine.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Why are you excited to build with Cynbit & BitElevate? (Optional)
              </label>
              <textarea
                name="coverLetter"
                rows={3}
                placeholder="Mention relevant projects, full-stack architectures you've built, or what you hope to achieve during the internship..."
                value={formData.coverLetter}
                onChange={handleChange}
                className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* Application Summary Card */}
            <div className="bg-[#070b12] rounded-2xl p-5 border border-white/[0.08] space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-slate-400">Candidate:</span>
                <span className="font-semibold text-white">{formData.fullName} ({formData.email})</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-slate-400">University / Specialization:</span>
                <span className="font-semibold text-white">{formData.university} — {formData.specialization}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-slate-400">Grade / Batch:</span>
                <span className="font-semibold text-white">{formData.gradeValue ? `${formData.gradeValue} ${formData.gradeType}` : 'Not Specified'} • Class of {formData.graduationYear}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Attached Resume:</span>
                <span className="font-semibold text-cyan-300 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {resumeFile ? resumeFile.name : 'Missing'}
                </span>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded border-white/[0.2] bg-[#070b12] text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs text-slate-400">
                I certify that all technical qualifications and portfolio links provided are accurate and represent my original engineering work.
              </span>
            </label>
          </div>
        )}

        {/* Wizard Navigation Buttons */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#006067] to-[#00838f] hover:from-[#00838f] hover:to-[#00acc1] shadow-lg hover:shadow-glow-teal transition-all flex items-center gap-2"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-xl hover:shadow-glow-teal transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Application Blueprint...
                </>
              ) : (
                <>
                  Submit Application Blueprint
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
