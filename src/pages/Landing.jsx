import Navbar from '@components/layout/Navbar';
import HeroSection from '@components/landing/HeroSection';
import StatsCounter from '@components/landing/StatsCounter';
import FeatureGrid from '@components/landing/FeatureGrid';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Rocket } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-16">
        <HeroSection />
        <StatsCounter />
        <FeatureGrid />

        {/* CTA Banner */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gov-900/40 via-transparent to-cyber-900/30 pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-4xl font-display font-bold text-white mb-4">
                  Ready to transform <span className="gradient-text">procurement</span>?
                </h2>
                <p className="text-white/50 mb-8 max-w-xl mx-auto">
                  Join 1800+ verified startups and 50+ government departments already on the platform.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/login/department" className="btn-primary px-8 py-3.5 text-base rounded-2xl group">
                    <Building2 size={18} />
                    Post a Challenge
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/login/startup" className="btn-secondary px-8 py-3.5 text-base rounded-2xl">
                    <Rocket size={18} />
                    Register Your Startup
                  </Link>
                </div>
              </div>
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
