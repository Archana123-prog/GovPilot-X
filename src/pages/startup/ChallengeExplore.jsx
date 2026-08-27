import { useEffect, useState } from 'react';
import { Search, Filter, ArrowRight, DollarSign } from 'lucide-react';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import SimilarityGauge from '@components/ui/SimilarityGauge';
import { getChallenges } from '@api/challenges';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SCORES = { 'ch-001': 0.94, 'ch-002': 0.82, 'ch-003': 0.75, 'ch-004': 0.79 };

export default function ChallengeExplore() {
  const [challenges, setChallenges] = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [interested, setInterested] = useState(new Set());

  useEffect(() => {
    getChallenges().then((d) => { setChallenges(d); setFiltered(d); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(challenges); return; }
    setFiltered(challenges.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, challenges]);

  const expressInterest = (id, title) => {
    setInterested(prev => new Set([...prev, id]));
    toast.success(`Interest registered for: ${title}`);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="section-heading">Explore Challenges</h1>
        <p className="section-subheading">AI-ranked matches based on your capability profile</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9 max-w-lg" placeholder="Search challenges by title or technology…" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="shimmer h-52 rounded-2xl" />)
          : filtered.map((c) => {
              const score = SCORES[c.id] || 0.7;
              const isInterested = interested.has(c.id);
              return (
                <Card key={c.id} hover>
                  <div className="flex items-start gap-4">
                    {/* Match score */}
                    <SimilarityGauge score={score} size={72} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-white leading-tight">{c.title}</h3>
                        <Badge status={c.status} />
                      </div>
                      <p className="text-xs text-white/50 mt-2 leading-relaxed line-clamp-2">{c.description}</p>
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-accent-green font-medium">
                          <DollarSign size={11} /> ₹{(c.pilot_budget / 1e5).toFixed(0)}L pilot budget
                        </span>
                        <span className="text-xs text-white/30">{c.applications} applicants</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {c.tags?.slice(0, 3).map(t => (
                          <span key={t} className="px-2 py-0.5 bg-surface-border text-white/50 text-[10px] rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-surface-border">
                    <button
                      onClick={() => !isInterested && expressInterest(c.id, c.title)}
                      className={isInterested ? 'btn-secondary flex-1 text-xs opacity-70' : 'btn-primary flex-1 text-xs'}>
                      {isInterested ? '✓ Interest Registered' : 'Express Interest'}
                    </button>
                    <Link to="/startup/pitch" className="btn-secondary text-xs px-4 py-2">
                      Submit Pitch <ArrowRight size={12} />
                    </Link>
                  </div>
                </Card>
              );
            })}
      </div>

      {!loading && filtered.length === 0 && (
        <Card className="py-16 text-center">
          <Filter size={36} className="mx-auto text-white/10 mb-3" />
          <p className="text-white/30">No challenges match your search.</p>
        </Card>
      )}
    </div>
  );
}
