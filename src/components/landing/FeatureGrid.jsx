import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Shield, TrendingUp, FileText, Zap, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    icon: Cpu,
    title: 'AI Matching Engine',
    desc: 'pgvector cosine similarity with ≥78% threshold matches the right startup to every challenge within seconds.',
    color: 'from-gov-600 to-gov-400',
    glow: 'shadow-glow-sm',
  },
  {
    icon: Shield,
    title: 'Policy Sandbox',
    desc: 'Automatic tender waiver logic bypasses EMD & turnover requirements for DPIIT-verified startups.',
    color: 'from-cyber-600 to-cyber-400',
    glow: 'shadow-glow-cyan',
  },
  {
    icon: TrendingUp,
    title: 'Milestone Tracker',
    desc: 'Kanban-style pilot dashboard with KPI-gated milestone payments ensuring accountability.',
    color: 'from-accent-purple to-gov-400',
    glow: 'shadow-glow-sm',
  },
  {
    icon: FileText,
    title: 'Procurement Passport',
    desc: 'One-time verified profile that travels across all government departments, eliminating repetitive paperwork.',
    color: 'from-accent-green to-cyber-500',
    glow: 'shadow-glow-cyan',
  },
  {
    icon: Zap,
    title: 'RAG Evaluation',
    desc: 'LLM-powered pitch deck analysis scores startup capability against challenge KPI criteria with cited rationale.',
    color: 'from-accent-amber to-accent-red',
    glow: 'shadow-glow-sm',
  },
  {
    icon: Users,
    title: 'DPIIT Integration',
    desc: 'Real-time verification of startup registration status with DIPP number validation at onboarding.',
    color: 'from-gov-500 to-cyber-600',
    glow: 'shadow-glow-sm',
  },
];

export default function FeatureGrid() {
  const gridRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.feature-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 75%',
          },
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-white mb-3">
            Built for <span className="gradient-text">Modern Governance</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Every feature designed to reduce friction between public sector innovation budgets and startup talent.
          </p>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card glass-hover rounded-2xl p-6 group">
              <div className={`w-10 h-10 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center mb-4 ${f.glow} group-hover:scale-110 transition-transform duration-300`}>
                <f.icon size={20} className="text-white" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
