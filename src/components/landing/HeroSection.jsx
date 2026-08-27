import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, Building2, Rocket, Shield } from 'lucide-react';

export default function HeroSection() {
  const heroRef    = useRef();
  const titleRef   = useRef();
  const subtitleRef = useRef();
  const ctaRef     = useRef();
  const badgeRef   = useRef();
  const orb1Ref    = useRef();
  const orb2Ref    = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(badgeRef.current,   { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(titleRef.current.children,
          { opacity: 0, y: 40, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.8, stagger: 0.1 },
          '-=0.3'
        )
        .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
        .fromTo(ctaRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.4');

      // Floating orbs
      gsap.to(orb1Ref.current, { y: -30, x: 15, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(orb2Ref.current, { y: 25, x: -20, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background orbs */}
      <div ref={orb1Ref} className="absolute top-1/4 left-1/4 w-96 h-96 bg-gov-700/20 rounded-full blur-3xl pointer-events-none" />
      <div ref={orb2Ref} className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyber-700/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]
                      bg-gov-900/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 hero-grid opacity-60 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-sm">
          <Shield size={14} className="text-gov-400" />
          <span className="text-white/60">India's First AI-Powered GovTech Procurement Platform</span>
          <span className="badge badge-active text-[10px]">LIVE</span>
        </div>

        {/* Title */}
        <h1 ref={titleRef} className="text-5xl md:text-7xl font-display font-bold leading-[1.05] mb-6 overflow-hidden">
          <span className="block text-white">Bridge Government</span>
          <span className="block text-gradient-animated">Challenges & Startup</span>
          <span className="block text-white">Innovation</span>
        </h1>

        {/* Subtitle */}
        <p ref={subtitleRef} className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          AI-powered matching connects verified DPIIT startups with government pilot programs.
          Transparent milestones, policy sandbox automation, and outcome-based payments.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/login/department" id="hero-dept-cta"
            className="btn-primary text-base px-8 py-3.5 rounded-2xl group">
            <Building2 size={18} />
            Government Portal
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login/startup" id="hero-startup-cta"
            className="btn-cyber text-base px-8 py-3.5 rounded-2xl group">
            <Rocket size={18} />
            Startup Portal
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-white/30">
          {['DPIIT Integrated', 'GFR Compliant', 'End-to-end Encrypted', 'CERT-In Certified'].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-gov-500 rounded-full" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
        <span className="text-xs text-white/25">Scroll to explore</span>
        <div className="w-5 h-8 border border-white/15 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-gov-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
