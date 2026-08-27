import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@components/layout/Navbar';
import Badge from '@components/ui/Badge';
import { getChallenges } from '@api/challenges';
import {
  Search, DollarSign, Users, ArrowRight, Filter,
  Building2, Rocket, Zap,
} from 'lucide-react';
import clsx from 'clsx';

const STATUS_TABS = ['ALL', 'ACTIVE', 'REVIEW'];
const TAG_FILTERS = ['All Tags', 'AI/ML', 'IoT', 'Computer Vision', 'NLP', 'GIS', 'Blockchain'];

export default function PublicChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [tab,        setTab]        = useState('ALL');
  const [tag,        setTag]        = useState('All Tags');

  useEffect(() => {
    getChallenges().then((d) => {
      setChallenges(d);
      setFiltered(d);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let data = challenges;
    if (tab !== 'ALL')       data = data.filter((c) => c.status === tab);
    if (tag !== 'All Tags')  data = data.filter((c) => c.tags?.includes(tag));
    if (search.trim())       data = data.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(data);
  }, [search, tab, tag, challenges]);

  const totalBudget = challenges.reduce((s, c) => s + (c.pilot_budget || 0), 0);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-16">

        {/* Hero header */}
        <section className="relative py-16 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 hero-grid opacity-30 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gov-900/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 text-sm">
              <Zap size={13} className="text-gov-400" />
              <span className="text-white/50">Open Government Challenges</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Find Your Next <span className="gradient-text">Government Pilot</span>
            </h1>
            <p className="text-white/50 max-w-xl mx-auto mb-8">
              Browse active challenges posted by government departments. Register as a startup to express interest and submit your pitch.
            </p>

            {/* Summary stats */}
            <div className="flex flex-wrap justify-center gap-5 text-sm">
              <div className="glass rounded-xl px-5 py-3">
                <p className="text-2xl font-display font-bold text-gov-400">{challenges.filter(c => c.status === 'ACTIVE').length}</p>
                <p className="text-white/40 text-xs">Active Challenges</p>
              </div>
              <div className="glass rounded-xl px-5 py-3">
                <p className="text-2xl font-display font-bold text-cyber-400">
                  ₹{(totalBudget / 1e5).toFixed(0)}L+
                </p>
                <p className="text-white/40 text-xs">Total Pilot Budget</p>
              </div>
              <div className="glass rounded-xl px-5 py-3">
                <p className="text-2xl font-display font-bold text-accent-green">
                  {challenges.reduce((s, c) => s + c.applications, 0)}
                </p>
                <p className="text-white/40 text-xs">Applications Received</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="px-4 pb-6 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-9"
                placeholder="Search by title, technology, or keyword…"
              />
            </div>

            {/* Status tabs */}
            <div className="flex gap-1 glass rounded-xl p-1 shrink-0">
              {STATUS_TABS.map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    tab === t ? 'bg-gov-600 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
                  )}>
                  {t}
                </button>
              ))}
            </div>

            {/* Tag filter */}
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="input-field shrink-0 w-auto text-sm"
            >
              {TAG_FILTERS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          <p className="text-xs text-white/30 mt-3">
            Showing {filtered.length} of {challenges.length} challenges
          </p>
        </section>

        {/* Challenge cards */}
        <section className="px-4 pb-20 max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="shimmer h-64 rounded-2xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center">
              <Filter size={44} className="mx-auto text-white/10 mb-4" />
              <p className="text-white/30 text-base font-medium">No challenges match your filters</p>
              <button onClick={() => { setSearch(''); setTab('ALL'); setTag('All Tags'); }}
                className="btn-ghost mt-3 text-sm text-gov-400">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((c) => (
                <div key={c.id}
                  className="glass-hover rounded-2xl p-6 flex flex-col gap-4 animate-fade-in">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 bg-gov-500/15 rounded-xl flex items-center justify-center shrink-0">
                      <Building2 size={18} className="text-gov-400" />
                    </div>
                    <Badge status={c.status} />
                  </div>

                  {/* Title + description */}
                  <div>
                    <h2 className="text-base font-semibold text-white leading-snug mb-2">{c.title}</h2>
                    <p className="text-xs text-white/50 leading-relaxed line-clamp-3">{c.description}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags?.map((t) => (
                      <span key={t}
                        className="px-2 py-0.5 bg-gov-900/40 border border-gov-700/25 text-gov-300 text-[10px] rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 pt-1 border-t border-surface-border text-xs text-white/40">
                    <span className="flex items-center gap-1.5">
                      <DollarSign size={11} className="text-accent-green" />
                      <span className="text-accent-green font-semibold">
                        ₹{(c.pilot_budget / 1e5).toFixed(0)}L
                      </span>
                      &nbsp;pilot budget
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={11} />
                      {c.applications} applicants
                    </span>
                    <span className="ml-auto text-[10px]">
                      {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </span>
                  </div>

                  {/* CTA */}
                  <Link to="/login/startup"
                    className="btn-primary w-full justify-center text-sm group">
                    <Rocket size={14} />
                    Apply as Startup
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bottom banner */}
        <section className="px-4 py-16 border-t border-surface-border">
          <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-10">
            <h2 className="text-2xl font-display font-bold text-white mb-3">
              Are you a Government Department?
            </h2>
            <p className="text-white/50 text-sm mb-6">
              Post a challenge and let our AI engine find the best-matched verified startups for your program.
            </p>
            <Link to="/login/department" className="btn-primary px-8 py-3 text-base rounded-2xl group inline-flex">
              <Building2 size={18} /> Post a Challenge
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        <footer className="border-t border-surface-border py-8 px-4 text-center text-white/25 text-sm">
          <p>© 2026 GovPilot-X · Ministry of Electronics & Information Technology · India</p>
        </footer>
      </div>
    </div>
  );
}
