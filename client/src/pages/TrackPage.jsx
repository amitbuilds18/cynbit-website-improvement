import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, FileSearch, CheckCircle2, Clock, AlertCircle, 
  ArrowRight, User, Briefcase, GraduationCap, FileText, ExternalLink 
} from 'lucide-react';
import { api } from '../services/api';

export default function TrackPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [appNumber, setAppNumber] = useState(searchParams.get('app') || '');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const autoApp = searchParams.get('app');
    if (autoApp) {
      handleLookup(autoApp, searchParams.get('email') || '');
    }
  }, [searchParams]);

  const handleLookup = async (code, userEmail) => {
    if (!code || !code.trim()) {
      setError('Please enter your Application Reference Code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.trackApplication(code.trim(), userEmail.trim());
      if (res.success && res.data) {
        setApplication(res.data);
      } else {
        setApplication(null);
        setError(res.message || 'No application found with these details.');
      }
    } catch (err) {
      setApplication(null);
      setError('Failed to connect to tracking API. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ app: appNumber, ...(email ? { email } : {}) });
    handleLookup(appNumber, email);
  };

  const getStageIndex = (status) => {
    switch (status) {
      case 'applied': return 0;
      case 'reviewing': return 1;
      case 'assessment': return 2;
      case 'interview': return 2;
      case 'offered': return 3;
      case 'rejected': return 3;
      default: return 0;
    }
  };

  const stages = [
    { key: 'applied', label: 'Applied' },
    { key: 'reviewing', label: 'Technical Screening' },
    { key: 'assessment', label: 'Assessment / Interview' },
    { key: 'decision', label: 'Offer Decision' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <FileSearch className="w-3.5 h-3.5" />
          <span>Live Tracking Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-headline">
          Track Your Application Status
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Enter your unique Application Reference Number (e.g. <span className="font-mono text-cyan-300">CYN-2026-0101</span>) to see real-time review progress and milestones.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-[#0d1522] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Application Code <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CYN-2026-0101"
                value={appNumber}
                onChange={(e) => setAppNumber(e.target.value)}
                className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#006067] to-[#00838f] hover:from-[#00838f] hover:to-[#00acc1] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-glow-teal transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Querying Database...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Track Application Blueprint</span>
              </>
            )}
          </button>
        </form>

        {/* Quick demo codes helper */}
        <div className="pt-4 mt-4 border-t border-white/[0.06] text-[11px] text-slate-500 text-center flex items-center justify-center gap-2 flex-wrap">
          <span>Try Demo Codes:</span>
          <button
            type="button"
            onClick={() => { setAppNumber('CYN-2026-0101'); handleLookup('CYN-2026-0101', ''); }}
            className="text-cyan-400 hover:underline font-mono"
          >
            CYN-2026-0101
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => { setAppNumber('CYN-2026-0102'); handleLookup('CYN-2026-0102', ''); }}
            className="text-cyan-400 hover:underline font-mono"
          >
            CYN-2026-0102
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => { setAppNumber('CYN-2026-0103'); handleLookup('CYN-2026-0103', ''); }}
            className="text-cyan-400 hover:underline font-mono"
          >
            CYN-2026-0103
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* TRACKING DETAILS VIEW */}
      {application && (
        <div className="bg-[#0d1522] border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
          
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/40">
                  {application.application_number}
                </span>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full ${
                  application.status === 'offered'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                    : application.status === 'rejected'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                      : 'bg-teal-950 text-teal-300 border border-teal-800/40'
                }`}>
                  Status: {application.status}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-headline">
                {application.job_title}
              </h2>
              <p className="text-xs text-slate-400">
                Applied on {new Date(application.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-400">
              <p className="text-white font-semibold">{application.full_name}</p>
              <p>{application.email}</p>
            </div>
          </div>

          {/* Visual 4-Stage Stepper */}
          <div className="py-4">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
              {stages.map((s, idx) => {
                const currentIdx = getStageIndex(application.status);
                const isPassed = idx < currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div key={s.key} className="text-center space-y-2">
                    <div className="relative flex items-center justify-center">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed 
                          ? 'bg-emerald-500 text-slate-950 shadow-md' 
                          : isCurrent 
                            ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-500/20 glow-teal-sm' 
                            : 'bg-white/[0.05] text-slate-500 border border-white/[0.1]'
                      }`}>
                        {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                    </div>
                    <p className={`text-[10px] sm:text-xs font-semibold ${
                      isCurrent ? 'text-cyan-300' : isPassed ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-headline">
              Stage History & Notes
            </h3>

            {application.timeline && application.timeline.length > 0 ? (
              <div className="space-y-3">
                {application.timeline.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-[#070b12] border border-white/[0.06] flex items-start gap-3.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-teal-950/70 border border-teal-800/40 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white font-headline">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No stage history logged yet.</p>
            )}
          </div>

          {/* Candidate Profile Details Card */}
          <div className="p-5 rounded-2xl bg-[#070b12] border border-white/[0.06] space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Submitted Credentials</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-slate-300">
              <div>
                <span className="text-slate-500 block">University:</span>
                <span>{application.university || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Degree & Major:</span>
                <span>{application.degree} ({application.specialization || 'General'})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Grade Score:</span>
                <span>{application.grade_value ? `${application.grade_value} ${application.grade_type}` : 'N/A'}</span>
              </div>
              {application.resume_filename && (
                <div className="sm:col-span-2 md:col-span-3 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Resume: {application.resume_original_name || application.resume_filename}
                  </span>
                  <a
                    href={`/uploads/${application.resume_filename}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>View / Download Resume</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
