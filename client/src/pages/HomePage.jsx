import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Code2, Cpu, Database, Layout, ShieldCheck, 
  Terminal, Search, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { api } from '../services/api';
import JobCard from '../components/JobCard';

export default function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.getJobs();
        if (res.success && res.data) {
          // Take top 6 roles for homepage preview
          setFeaturedJobs(res.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load featured jobs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleQuickTrack = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/track?app=${encodeURIComponent(trackingNumber.trim())}`);
    }
  };

  const tracks = [
    {
      title: 'Full Stack Architecture',
      desc: 'Build real-world GitHub portfolio projects in React, Node.js, Express, PostgreSQL & MongoDB with automated reviews.',
      icon: Code2,
      badge: 'High Priority Track',
      color: 'from-teal-500/20 to-cyan-500/20',
      border: 'border-teal-500/30'
    },
    {
      title: 'Autonomous AI Agents',
      desc: 'Engineer cognitive automation, vector search pipelines, and agent reasoning loops with Python & LangChain.',
      icon: Cpu,
      badge: 'Emerging Tech',
      color: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/30'
    },
    {
      title: 'Cloud & Systems Engineering',
      desc: 'Deploy resilient microservices, Docker containers, automated CI/CD pipelines, and relational database schemas.',
      icon: Database,
      badge: 'Infrastructure',
      color: 'from-indigo-500/20 to-purple-500/20',
      border: 'border-indigo-500/30'
    },
    {
      title: 'UI/UX & Product Design',
      desc: 'Design accessible, high-performance design systems, interactive prototypes, and human-centric web applications.',
      icon: Layout,
      badge: 'Product Design',
      color: 'from-amber-500/20 to-rose-500/20',
      border: 'border-amber-500/30'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 overflow-hidden">
        {/* Glow ambient background lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-r from-teal-500/15 via-cyan-500/20 to-teal-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Top announcement pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-glow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>BitElevate Talent Engine 2026 Active • 20 Positions Open</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08] font-headline">
            Stop Watching Tutorials. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-200">
              Start Doing The Work.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Cynbit Technologies is hiring engineers, designers, and AI architects. Experience seamless application with direct resume uploads, verified skills, and live application tracking.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/jobs"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#006067] to-[#00838f] hover:from-[#00838f] hover:to-[#00acc1] shadow-xl hover:shadow-glow-teal hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Explore All 20 Openings</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/track"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] hover:border-cyan-400/50 transition-all flex items-center justify-center gap-2"
            >
              <span>Track Existing Application</span>
              <Terminal className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>

          {/* Real-time Fast Application Tracker Box */}
          <div className="pt-8 max-w-xl mx-auto">
            <form onSubmit={handleQuickTrack} className="glass-panel p-2.5 rounded-2xl flex flex-col sm:flex-row items-center gap-2 shadow-2xl border border-white/[0.1]">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter Application Code (e.g. CYN-2026-0101)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-[#070b12]/80 border border-transparent rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-md"
              >
                Track Status
              </button>
            </form>
            <p className="text-[11px] text-slate-400 pt-2 text-center">
              Already submitted your blueprint? Paste your application code above for live status.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/[0.08]">
            <div className="p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-headline">20</div>
              <div className="text-xs text-slate-400 font-medium">Active Openings</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-headline">100%</div>
              <div className="text-xs text-slate-400 font-medium">Remote & Hybrid Options</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-headline">4-Stage</div>
              <div className="text-xs text-slate-400 font-medium">Transparent Pipeline</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-headline">PostgreSQL</div>
              <div className="text-xs text-slate-400 font-medium">Powered by Neon DB</div>
            </div>
          </div>

        </div>
      </section>

      {/* BIT ELEVATE TRACKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Core Engineering Tracks</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-headline">
            Engineered For Immediate Momentum
          </h2>
          <p className="text-slate-400 text-sm">
            Stop following rigid, outdated curriculums. Build high-impact solutions with direct code reviews from architects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((track, i) => {
            const Icon = track.icon;
            return (
              <div 
                key={i} 
                className={`bg-[#0d1522] border ${track.border} rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.color} border border-white/[0.1] flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6 text-cyan-300" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/40 inline-block mb-2">
                    {track.badge}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 font-headline">{track.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">{track.desc}</p>
                </div>

                <Link
                  to="/jobs"
                  className="text-xs font-bold text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1 group/link"
                >
                  <span>Explore Track Roles</span>
                  <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED ROLES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/[0.08]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Featured Opportunities</span>
            <h2 className="text-3xl font-extrabold text-white font-headline mt-1">
              Active Job & Internship Openings
            </h2>
          </div>
          <Link
            to="/jobs"
            className="text-xs font-bold uppercase tracking-wider text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5"
          >
            <span>View All 20 Openings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-64 rounded-2xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* RECRUITMENT PIPELINE TRANSPARENCY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0b121e] border border-cyan-500/20 rounded-3xl p-8 sm:p-14 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Our Operating Model</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-headline">
              A Transparent, 4-Stage Hiring Blueprint
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              No black-hole applications. When you submit your blueprint, you receive an application reference code to track every stage in real-time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Direct Resume Ingestion</h4>
                  <p className="text-xs text-slate-400">No Google Drive sharing permissions hurdles. Upload PDF/DOCX directly.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Real-Time Stage Updates</h4>
                  <p className="text-xs text-slate-400">Track progress through Review, Technical Assessment, and Architectural Interview.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Flexible Grading Support</h4>
                  <p className="text-xs text-slate-400">Accommodates both 10-point CGPA and percentage scoring systems.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Candidate Data Integrity</h4>
                  <p className="text-xs text-slate-400">Secure relational database powered by PostgreSQL on Neon Cloud.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
