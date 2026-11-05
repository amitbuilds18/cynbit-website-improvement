import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Briefcase, MapPin, CheckCircle2, ArrowLeft, ArrowRight, 
  Sparkles, ShieldCheck, Copy, Check 
} from 'lucide-react';
import { api } from '../services/api';
import MultiStepForm from '../components/MultiStepForm';

export default function JobDetailPage() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadJob() {
      setLoading(true);
      try {
        const res = await api.getJobBySlug(slug);
        if (res.success && res.data) {
          setJob(res.data);
        } else {
          setError(res.message || 'Position not found.');
        }
      } catch (err) {
        setError('Failed to load job details. Please check the network.');
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [slug]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading architectural specifications...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-4 bg-rose-950/70 border border-rose-500/40 rounded-2xl text-rose-300 text-sm">
          {error || 'Position not found.'}
        </div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all openings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back button */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Open Positions</span>
        </Link>
      </div>

      {/* Main Grid: Left Side Job Specs, Right Side Application Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Job Description & Details */}
        <div className="lg:col-span-5 space-y-8 bg-[#0d1522] border border-white/[0.08] rounded-3xl p-6 sm:p-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                job.type === 'Internship' 
                  ? 'bg-teal-950/70 text-teal-300 border-teal-800/40' 
                  : 'bg-cyan-950/70 text-cyan-300 border-cyan-800/40'
              }`}>
                {job.type}
              </span>
              <span className="text-[11px] text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06]">
                {job.department}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-headline tracking-tight mb-3">
              {job.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-400 pb-6 border-b border-white/[0.08]">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                Actively Reviewing
              </span>
            </div>
          </div>

          {/* Role Overview */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-headline">Role Overview</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{job.description}</p>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-headline">Key Responsibilities</h3>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-headline">Candidate Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="pt-4 border-t border-white/[0.08] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tech Stack & Tooling</h4>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white/[0.05] text-cyan-300 px-3 py-1 rounded-full border border-cyan-800/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Multi-Step Application Wizard or Success View */}
        <div className="lg:col-span-7">
          {submittedApp ? (
            /* Application Success Confirmation Card */
            <div className="bg-[#0d1522] border border-teal-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center mx-auto text-teal-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Blueprint Successfully Submitted</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-headline">
                  Application Received!
                </h2>
                <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                  Your profile has been ingested into the BitElevate talent engine. Use your reference code below to track your application review stages in real-time.
                </p>
              </div>

              {/* Reference Code Box */}
              <div className="bg-[#070b12] border border-cyan-500/30 rounded-2xl p-5 max-w-sm mx-auto flex items-center justify-between shadow-inner">
                <div className="text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tracking Code</span>
                  <div className="text-xl font-mono font-extrabold text-cyan-300">
                    {submittedApp.applicationNumber}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(submittedApp.applicationNumber)}
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
                  title="Copy Code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/track?app=${submittedApp.applicationNumber}`}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-glow-teal transition-all flex items-center justify-center gap-2"
                >
                  <span>Track Application Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/jobs"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Explore More Roles
                </Link>
              </div>
            </div>
          ) : (
            /* Multi-Step Wizard */
            <MultiStepForm
              job={job}
              onApplicationSuccess={(appData) => setSubmittedApp(appData)}
            />
          )}
        </div>

      </div>

    </div>
  );
}
