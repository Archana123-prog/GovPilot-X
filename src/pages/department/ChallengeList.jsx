import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Cpu, ArrowRight, PlusCircle } from 'lucide-react';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import { getChallenges } from '@api/challenges';
import { matchStartups } from '@api/matching';

const STATUS_TABS = ['ALL', 'ACTIVE', 'REVIEW', 'COMPLETED'];

export default function ChallengeList() {
  const [challenges, setChallenges] = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [search, setSearch]         = useState('');
  const [tab, setTab]               = useState('ALL');
  const [loading, setLoading]       = useState(true);
  const [matching, setMatching]     = useState(null);

  useEffect(() => {
    getChallenges().then((d) => { setChallenges(d); setFiltered(d); setLoading(false); });
  }, []);

  useEffect(() => {
    let data = challenges;
    if (tab !== 'ALL') data = data.filter((c) => c.status === tab);
    if (search) data = data.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
    setFiltered(data);
  }, [search, tab, challenges]);

  const handleMatch = async (id) => {
    setMatching(id);
    await matchStartups(id);
    setMatching(null);
    window.location.href = `/department/matches?id=${id}`;
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-heading">Challenges</h1>
          <p className="section-subheading">{filtered.length} challenges found</p>
        </div>
        <Link to="/department/create" className="btn-primary">
          <PlusCircle size={16} /> Post New
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9" placeholder="Search challenges…" />
        </div>
        <div className="flex gap-1.5 glass rounded-xl p-1">
          {STATUS_TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === t ? 'bg-gov-600 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                {['Challenge', 'Budget', 'Applications', 'AI Matches', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left pb-3 text-xs text-white/40 font-medium uppercase tracking-wider">
                    {h !== 'Challenge' && <span className="pl-4">{h}</span>}
                    {h === 'Challenge' && h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="py-3"><div className="shimmer h-10 rounded-xl" /></td></tr>
                  ))
                : filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-hover transition-colors group">
                      <td className="py-4 pr-4">
                        <p className="font-medium text-white">{c.title}</p>
                        <p className="text-xs text-white/40 mt-0.5 flex gap-1 flex-wrap">
                          {c.tags?.slice(0, 2).map((t) => (
                            <span key={t} className="px-2 py-0.5 bg-surface-border rounded-full">{t}</span>
                          ))}
                        </p>
                      </td>
                      <td className="py-4 pl-4">
                        <p className="text-white font-medium">₹{(c.pilot_budget / 1e5).toFixed(0)}L</p>
                      </td>
                      <td className="py-4 pl-4 text-white/60">{c.applications}</td>
                      <td className="py-4 pl-4">
                        <span className="text-cyber-400 font-medium">{c.match_count}</span>
                      </td>
                      <td className="py-4 pl-4"><Badge status={c.status} /></td>
                      <td className="py-4 pl-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMatch(c.id)}
                            disabled={matching === c.id}
                            className="btn-cyber text-xs px-3 py-1.5">
                            {matching === c.id ? (
                              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                              </svg>
                            ) : <Cpu size={12} />}
                            Match
                          </button>
                          <Link to={`/department/matches?id=${c.id}`} className="btn-ghost text-xs px-3 py-1.5">
                            <ArrowRight size={12} /> View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="py-12 text-center text-white/30">
              <Filter size={32} className="mx-auto mb-3 opacity-30" />
              <p>No challenges match your filters.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
