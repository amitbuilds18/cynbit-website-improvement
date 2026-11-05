import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, Clock, Filter, Search, ArrowRight, 
  ExternalLink, FileText, ChevronRight, MessageSquare, ShieldAlert, Sparkles, RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';

export default function RecruiterPage() {
  const [applications, setApplications] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [newStage, setNewStage] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    loadRecruiterData();
  }, []);

  async function loadRecruiterData() {
    setLoading(true);
    try {
      const res = await api.getRecruiterApplications();
      if (res.success) {
        setApplications(res.data);
        setMetrics(res.metrics || {});
      }
    } catch (err) {
      console.error('Failed to load recruiter data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectApp = (app) => {
    setSelectedApp(app);
    setNewStage(app.status);
    setInternalNote(app.internal_notes || '');
    setStatusMessage(null);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setUpdating(true);
    setStatusMessage(null);

    try {
      const res = await api.updateApplicationStatus(selectedApp.id, {
        status: newStage,
        internalNotes: internalNote
      });

      if (res.success) {
        setStatusMessage({ type: 'success', text: `Candidate advanced to "${newStage}" stage.` });
        // Refresh local list
        await loadRecruiterData();
        setSelectedApp(prev => ({ ...prev, status: newStage, internal_notes: internalNote }));
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Update failed.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error updating candidate status.' });
    } finally {
      setUpdating(false);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesStage = filterStage === 'All' || app.status.toLowerCase() === filterStage.toLowerCase();
    const matchesSearch = !searchQuery || 
      app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.application_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.university && app.university.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStage && matchesSearch;
  });

  const stagesList = [
    { key: 'All', label: 'All Pool' },
    { key: 'applied', label: 'New Applied' },
    { key: 'reviewing', label: 'Screening' },
    { key: 'assessment', label: 'Assessment' },
    { key: 'interview', label: 'Interview' },
    { key: 'offered', label: 'Offered' },
    { key: 'rejected', label: 'Concluded' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Recruiter Control Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-headline">
            BitElevate Candidate Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time hiring management, resume preview, and stage advancement for Cynbit Technologies.
          </p>
        </div>

        <button
          onClick={loadRecruiterData}
          className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-slate-300 hover:text-white flex items-center gap-2 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Pipeline
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#0d1522] border border-white/[0.08] p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Applicants</span>
          <div className="text-2xl font-bold text-white font-headline mt-1">{metrics.total || 0}</div>
        </div>
        <div className="bg-[#0d1522] border border-teal-500/20 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">New Applied</span>
          <div className="text-2xl font-bold text-teal-300 font-headline mt-1">{metrics.applied || 0}</div>
        </div>
        <div className="bg-[#0d1522] border border-cyan-500/20 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Under Review</span>
          <div className="text-2xl font-bold text-cyan-300 font-headline mt-1">{metrics.reviewing || 0}</div>
        </div>
        <div className="bg-[#0d1522] border border-blue-500/20 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Assessments</span>
          <div className="text-2xl font-bold text-blue-300 font-headline mt-1">{metrics.assessment || 0}</div>
        </div>
        <div className="bg-[#0d1522] border border-purple-500/20 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Interviews</span>
          <div className="text-2xl font-bold text-purple-300 font-headline mt-1">{metrics.interview || 0}</div>
        </div>
        <div className="bg-[#0d1522] border border-emerald-500/20 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Offers Extended</span>
          <div className="text-2xl font-bold text-emerald-300 font-headline mt-1">{metrics.offered || 0}</div>
        </div>
      </div>

      {/* Main Grid: Left Side Applications List, Right Side Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Applications Table / Cards */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Controls: Search and Stage filter */}
          <div className="bg-[#0d1522] border border-white/[0.08] p-4 rounded-2xl space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidate name, college, role, or CYN-..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Stage filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {stagesList.map(s => (
                <button
                  key={s.key}
                  onClick={() => setFilterStage(s.key)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    filterStage === s.key
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Applications */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-28 bg-[#0d1522] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredApps.length > 0 ? (
            <div className="space-y-3">
              {filteredApps.map(app => {
                const isSelected = selectedApp && selectedApp.id === app.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => handleSelectApp(app)}
                    className={`bg-[#0d1522] border rounded-2xl p-5 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-cyan-400 bg-[#121d2f] shadow-lg ring-1 ring-cyan-400/30' 
                        : 'border-white/[0.08] hover:border-white/[0.2] hover:bg-[#101a2b]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm font-headline">{app.full_name}</h3>
                          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                            {app.application_number}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{app.job_title} • {app.job_department}</p>
                      </div>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        app.status === 'offered'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                          : app.status === 'rejected'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                            : 'bg-teal-950 text-teal-300 border border-teal-800/40'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/[0.06]">
                      <span className="truncate max-w-[260px]">
                        {app.university || 'University not listed'}
                      </span>
                      <span className="text-teal-400 font-semibold flex items-center gap-1">
                        Inspect Profile
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#0d1522] border border-white/[0.08] rounded-2xl p-6 text-slate-400 text-xs">
              No applicants match the selected stage filter.
            </div>
          )}
        </div>

        {/* Right Column: Candidate Profile & Status Advancement Panel */}
        <div className="lg:col-span-5">
          {selectedApp ? (
            <div className="bg-[#0d1522] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl sticky top-28">
              
              {/* Profile Header */}
              <div className="pb-4 border-b border-white/[0.08]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {selectedApp.application_number}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(selectedApp.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white font-headline">
                  {selectedApp.full_name}
                </h2>
                <p className="text-xs text-cyan-400 font-medium">{selectedApp.job_title}</p>
              </div>

              {/* Contact & Links */}
              <div className="space-y-2 text-xs text-slate-300">
                <p><strong className="text-slate-500">Email:</strong> {selectedApp.email}</p>
                <p><strong className="text-slate-500">Phone:</strong> {selectedApp.phone}</p>
                <div className="flex items-center gap-3 pt-1">
                  {selectedApp.linkedin_url && (
                    <a href={selectedApp.linkedin_url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                      LinkedIn <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {selectedApp.github_url && (
                    <a href={selectedApp.github_url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                      GitHub <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {selectedApp.portfolio_url && (
                    <a href={selectedApp.portfolio_url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                      Portfolio <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Education & Grade */}
              <div className="p-4 rounded-xl bg-[#070b12] border border-white/[0.06] space-y-1.5 text-xs text-slate-300">
                <p><strong className="text-slate-400">College:</strong> {selectedApp.university}</p>
                <p><strong className="text-slate-400">Degree:</strong> {selectedApp.degree} • {selectedApp.specialization}</p>
                <p><strong className="text-slate-400">Score:</strong> {selectedApp.grade_value ? `${selectedApp.grade_value} ${selectedApp.grade_type}` : 'N/A'}</p>
              </div>

              {/* Resume Download / View */}
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="text-white font-medium truncate max-w-[170px]">
                    {selectedApp.resume_original_name || 'Resume Document'}
                  </span>
                </div>
                <a
                  href={`/uploads/${selectedApp.resume_filename || 'sample_resume.pdf'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-300 hover:underline font-bold flex items-center gap-1"
                >
                  View PDF <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Stage Progression Form */}
              <form onSubmit={handleUpdateStatus} className="pt-4 border-t border-white/[0.08] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Update Hiring Stage
                </h4>

                {statusMessage && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    statusMessage.type === 'success' ? 'bg-teal-950/70 text-teal-300 border border-teal-500/30' : 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
                  }`}>
                    {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
                    <span>{statusMessage.text}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Candidate Status
                  </label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="applied">Applied (Initial Intake)</option>
                    <option value="reviewing">Screening (Profile & GitHub Review)</option>
                    <option value="assessment">Assessment (Technical Coding Assigned)</option>
                    <option value="interview">Interview (Architectural Discussion)</option>
                    <option value="offered">Offered (Extend Internship / Full-time Offer)</option>
                    <option value="rejected">Concluded / Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Internal Recruiter Notes & Feedback
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add evaluation remarks, code review score, or interview notes..."
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {updating ? 'Advancing Stage...' : 'Save & Advance Stage'}
                </button>
              </form>

            </div>
          ) : (
            <div className="bg-[#0d1522] border border-white/[0.08] rounded-3xl p-8 text-center text-slate-400 text-xs space-y-3">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="font-semibold text-white">Select a candidate from the left list to review credentials, preview resume, and advance hiring stages.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
