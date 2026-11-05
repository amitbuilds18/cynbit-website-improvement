import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, ArrowRight, Sparkles } from 'lucide-react';

export default function JobCard({ job }) {
  const isInternship = job.type === 'Internship';

  return (
    <div className="group relative bg-[#0d1522] hover:bg-[#121d2f] border border-white/[0.08] hover:border-cyan-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-teal-500/0 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div>
        {/* Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
            isInternship 
              ? 'bg-teal-950/70 text-teal-300 border-teal-800/40' 
              : 'bg-cyan-950/70 text-cyan-300 border-cyan-800/40'
          }`}>
            {job.type}
          </span>
          <span className="text-[11px] font-medium text-slate-400 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.06]">
            {job.department}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-headline mb-2.5">
          {job.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            {job.location || 'Remote / Jaipur'}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            Actively Hiring
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-6 font-normal">
          {job.description}
        </p>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {job.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-white/[0.03] text-slate-300 px-2 py-0.5 rounded-md border border-white/[0.06]"
              >
                {tag}
              </span>
            ))}
            {job.tags.length > 4 && (
              <span className="text-[11px] text-slate-500 py-0.5">
                +{job.tags.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-xs font-semibold text-teal-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          BitElevate Track
        </span>
        <Link
          to={`/jobs/${job.slug}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-white bg-white/[0.06] hover:bg-[#006067] px-4 py-2 rounded-full border border-white/[0.1] hover:border-transparent transition-all group-hover:translate-x-1"
        >
          <span>View & Apply</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
