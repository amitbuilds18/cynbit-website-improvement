import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Briefcase, Sparkles, RefreshCcw } from 'lucide-react';
import { api } from '../services/api';
import JobCard from '../components/JobCard';

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [selectedDept, setSelectedDept] = useState(searchParams.get('department') || 'All');
  const [departments, setDepartments] = useState(['All']);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      try {
        const res = await api.getJobs({
          type: selectedType !== 'All' ? selectedType : '',
          department: selectedDept !== 'All' ? selectedDept : '',
          search: searchQuery
        });

        if (res.success && res.data) {
          setJobs(res.data);
          if (res.departments && res.departments.length > 0) {
            setDepartments(res.departments);
          }
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [selectedType, selectedDept, searchQuery]);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    const p = new URLSearchParams(searchParams);
    if (type === 'All') p.delete('type');
    else p.set('type', type);
    setSearchParams(p);
  };

  const handleDeptChange = (dept) => {
    setSelectedDept(dept);
    const p = new URLSearchParams(searchParams);
    if (dept === 'All') p.delete('department');
    else p.set('department', dept);
    setSearchParams(p);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedDept('All');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Opportunities</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-headline tracking-tight">
          Explore Open Roles at Cynbit
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Join our architectural circle. We are looking for ambitious builders in full-stack engineering, autonomous AI systems, and digital design.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0d1522] border border-white/[0.08] rounded-2xl p-4 sm:p-6 space-y-5 shadow-xl">
        
        {/* Top Search & Type toggles */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by role, skill (e.g. React, Node, AI)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#070b12] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Type tabs (All / Internship / Full-Time) */}
          <div className="flex items-center gap-1.5 bg-[#070b12] p-1.5 rounded-xl border border-white/[0.08] w-full sm:w-auto">
            {['All', 'Internship', 'Full-Time'].map((t) => (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedType === t
                    ? 'bg-[#006067] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'All' ? 'All Roles' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Department Chips */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Department:
          </span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => handleDeptChange(dept)}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
                selectedDept === dept
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing <strong className="text-white">{jobs.length}</strong> matching positions</span>
        {(searchQuery || selectedType !== 'All' || selectedDept !== 'All') && (
          <button
            onClick={handleReset}
            className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <RefreshCcw className="w-3 h-3" />
            Reset all filters
          </button>
        )}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-64 rounded-2xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0d1522] border border-white/[0.08] rounded-3xl p-8 space-y-4">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white font-headline">No matching positions found</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto">
            We couldn't find any openings matching your exact search criteria. Try clearing filters or searching for broader skills like "React" or "Python".
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-full bg-[#006067] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#00838f] transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
}
