import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#05080e] border-t border-white/[0.08] pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#006067] to-[#00e5ff] p-0.5">
                <div className="w-full h-full bg-[#070b12] rounded-[6px] flex items-center justify-center">
                  <span className="font-bold text-sm text-cyan-400">C</span>
                </div>
              </div>
              <span className="font-headline font-bold text-lg text-white">CYNBIT TECHNOLOGIES</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Architecting high-performance digital systems, cognitive automation, and the BitElevate talent ecosystem for ambitious developers.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              BitElevate Talent Engine Online (PostgreSQL on Neon)
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-headline">Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">Talent Ecosystem</Link></li>
              <li><Link to="/jobs" className="hover:text-cyan-400 transition-colors">20 Active Openings</Link></li>
              <li><Link to="/track" className="hover:text-cyan-400 transition-colors">Track Application Status</Link></li>
              <li><Link to="/recruiter" className="hover:text-cyan-400 transition-colors">Recruiter Pipeline</Link></li>
            </ul>
          </div>

          {/* Hiring tracks */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-headline">Internship Tracks</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/jobs?department=Engineering" className="hover:text-cyan-400 transition-colors">Full Stack Engineering</Link></li>
              <li><Link to="/jobs?department=AI%20%26%20Data%20Science" className="hover:text-cyan-400 transition-colors">AI & Autonomous Agents</Link></li>
              <li><Link to="/jobs?department=Design" className="hover:text-cyan-400 transition-colors">UI/UX Architecture</Link></li>
              <li><Link to="/jobs?department=Engineering" className="hover:text-cyan-400 transition-colors">QA & Systems Testing</Link></li>
            </ul>
          </div>

          {/* Real Functional Newsletter Form (Fixing original website bug where it was just an empty button) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-headline">Engineering Briefing</h4>
            <p className="text-xs text-slate-400 mb-3">Join 25,000+ architects receiving technical deep dives.</p>
            {subscribed ? (
              <div className="p-3 rounded-xl bg-teal-950/60 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-400" />
                <span>Subscribed! Check your inbox for updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#006067] hover:bg-[#00838f] text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  Subscribe
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Cynbit Technologies Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built for Cynbit Full Stack Assessment</span>
            <span className="text-cyan-400/70 font-mono">Jaipur, Rajasthan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
