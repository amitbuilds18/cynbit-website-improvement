import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Compass, FileSearch, ShieldCheck, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Ecosystem', path: '/', icon: Compass },
    { name: 'Job Openings', path: '/jobs', badge: '20 Active', icon: Briefcase },
    { name: 'Track Application', path: '/track', icon: FileSearch },
    { name: 'Recruiter Portal', path: '/recruiter', icon: ShieldCheck }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#070b12]/90 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006067] to-[#00e5ff] p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#070b12] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                  C
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  CYNBIT
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                  BitElevate
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Talent & Recruitment Architecture</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-[#006067]/30 text-cyan-300 border border-teal-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.name}
                  {link.badge && (
                    <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Direct Apply CTA (Fixes deceptive Join Us button bug) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/jobs"
              className="bg-gradient-to-r from-[#006067] to-[#00838f] hover:from-[#00838f] hover:to-[#00acc1] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-glow-teal hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              Apply For Roles
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#070b12] px-4 pt-4 pb-6 space-y-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-[#006067]/30 text-cyan-300 border border-teal-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-[#006067] hover:bg-[#00838f] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              Apply For Roles
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
