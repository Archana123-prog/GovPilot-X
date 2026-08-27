import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@components/layout/Navbar';
import {
  Target, Zap, Shield, Users, TrendingUp, FileText,
  Building2, Rocket, ArrowRight, CheckCircle, Globe,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TEAM_VALUES = [
  { icon: Target,    title: 'Mission-Driven',   desc: 'Every feature is designed to reduce friction between government budgets and startup talent.' },
  { icon: Shield,    title: 'Transparency First',desc: 'Every rupee disbursed is milestone-gated. No payment without verified outcomes.' },
  { icon: Zap,       title: 'AI-Augmented',     desc: 'Semantic matching removes the bias and inefficiency of manual shortlisting.' },
  { icon: Globe,     title: 'India-Scale',       desc: 'Built to handle thousands of departments across all 28 states and 8 UTs.' },
];

const TIMELINE = [
  { phase: 'Phase 1', label: 'Platform Launch',       desc: 'Department & Startup portals, challenge posting, Pilot Tracker Kanban.',       done: true  },
  { phase: 'Phase 2', label: 'Policy Sandbox',         desc: 'Tender waiver automation, micro-contract PDF generator, Procurement Passport.', done: false },
  { phase: 'Phase 3', label: 'AI Engine Go-Live',      desc: 'Live pgvector matching, GPT-4o RAG pitch evaluation, Celery async pipeline.',   done: false },
  { phase: 'Phase 4', label: 'National Rollout',       desc: 'DPIIT API integration, GFR compliance, 500+ department onboarding.',            done: false },
];

export default function About() {
  const pageRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-fade', { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-fade', start: 'top 80%' } });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-16">

        {/* Hero */}
        <section className="relative py-24 px-4 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gov-900/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 hero-grid opacity-30 pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 text-sm">
              <Building2 size={13} className="text-gov-400" />
              <span className="text-white/50">About GovPilot-X</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-5 leading-tight">
              Reimagining How India<br />
              <span className="gradient-text">Buys Innovation</span>
            </h1>
            <p className="text-lg text-white/50 leading-relaxed max-w-2xl mx-auto">
              GovPilot-X is a government-mandated platform that uses AI to connect public sector
              departments with verified DPIIT startups — replacing slow, opaque tender processes
              with fast, transparent, outcome-based pilot programs.
            </p>
          </div>
        </section>

        {/* The Problem */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto about-fade">
            <div className="glass rounded-3xl p-10 grid md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl font-display font-bold text-white mb-4">The Problem</h2>
                <ul className="space-y-3">
                  {[
                    'Startups face EMD deposits of ₹5–50L just to bid for government contracts',
                    'Turnover requirements (often 3x contract value) eliminate all early-stage startups',
                    'Manual vendor discovery relies on personal networks, not capability',
                    'Zero visibility into pilot progress — departments have no real-time KPI tracking',
                    'Startups repeat the same verification paperwork for every department',
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-white/60">
                      <span className="w-1.5 h-1.5 bg-accent-red rounded-full mt-2 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white mb-4">Our Solution</h2>
                <ul className="space-y-3">
                  {[
                    'AI matching surfaces the right startup from 1800+ profiles in seconds',
                    'DPIIT-verified startups automatically bypass EMD and turnover rules',
                    'One Procurement Passport — verified once, accepted everywhere',
                    'Kanban milestone tracker ties every payout to a verified outcome',
                    'GPT-4o evaluates pitch decks against challenge KPIs objectively',
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-white/60">
                      <CheckCircle size={14} className="text-accent-green mt-0.5 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-white text-center mb-10 about-fade">
              Platform Values
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {TEAM_VALUES.map((v) => (
                <div key={v.title} className="about-fade glass-hover rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-gov-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <v.icon size={22} className="text-gov-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{v.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-white text-center mb-10 about-fade">
              Development Roadmap
            </h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-surface-border" />

              <div className="space-y-6">
                {TIMELINE.map((t, i) => (
                  <div key={t.phase} className="about-fade flex gap-5 pl-14 relative">
                    {/* Dot */}
                    <div className={`absolute left-3 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${t.done ? 'border-accent-green bg-accent-green/20' : 'border-surface-border bg-surface-card'}`}>
                      {t.done && <CheckCircle size={10} className="text-accent-green" />}
                    </div>
                    <div className="glass rounded-2xl p-5 flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full
                          ${t.done ? 'bg-accent-green/15 text-accent-green' : 'bg-surface-border text-white/40'}`}>
                          {t.phase}
                        </span>
                        <h3 className="text-sm font-semibold text-white">{t.label}</h3>
                        {t.done && <span className="text-[10px] text-accent-green ml-auto">✓ Complete</span>}
                        {!t.done && <span className="text-[10px] text-white/30 ml-auto">Upcoming</span>}
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tech stack callout */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto about-fade">
            <div className="glass rounded-3xl p-8">
              <h2 className="text-xl font-display font-bold text-white mb-6 text-center">Built With</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {['React 18', 'Vite', 'Tailwind CSS', 'GSAP', 'FastAPI', 'PostgreSQL', 'pgvector',
                  'OpenAI text-embedding-3-small', 'GPT-4o', 'Celery', 'Redis', 'Zustand', 'dnd-kit', 'Recharts'
                ].map((t) => (
                  <span key={t} className="px-3 py-1.5 bg-gov-900/40 border border-gov-700/30 text-gov-300 text-xs rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-xl mx-auto about-fade">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-white/50 mb-8">
              Join India's most innovative government procurement platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login/department" className="btn-primary px-8 py-3 text-base rounded-2xl group">
                <Building2 size={18} /> Government Portal
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login/startup" className="btn-cyber px-8 py-3 text-base rounded-2xl">
                <Rocket size={18} /> Startup Portal
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-surface-border py-8 px-4 text-center text-white/25 text-sm">
          <p>© 2026 GovPilot-X · Ministry of Electronics & Information Technology · India</p>
        </footer>
      </div>
    </div>
  );
}
