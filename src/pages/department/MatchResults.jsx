import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Cpu, RefreshCw, CheckCircle, ExternalLink } from 'lucide-react';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import SimilarityGauge from '@components/ui/SimilarityGauge';
import { matchStartups } from '@api/matching';
import { getChallenges } from '@api/challenges';
import toast from 'react-hot-toast';

export default function MatchResults() {
  const [params] = useSearchParams();
  const challengeId = params.get('id');

  const [results, setResults]     = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [selectedId, setSelectedId] = useState(challengeId || '');
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    getChallenges().then(setChallenges);
  }, []);

  const runMatch = async () => {
    if (!selectedId) return toast.error('Select a challenge first');
    setLoading(true);
    const res = await matchStartups(selectedId);
    setResults(res);
    setLoading(false);
    toast.success(`Found ${res.length} matching startups`);
  };

  useEffect(() => {
    if (selectedId) runMatch();
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-heading">AI Match Results</h1>
          <p className="section-subheading">Cosine similarity ≥ 0.78 · Ranked by relevance score</p>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="input-field max-w-[280px] text-sm"
          >
            <option value="">Select a challenge…</option>
            {challenges.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <button onClick={runMatch} disabled={loading} className="btn-primary">
            {loading ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : <Cpu size={16} />}
            {loading ? 'Matching…' : 'Run Match'}
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="shimmer h-40 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="space-y-4">
          {results.map((startup, i) => (
            <Card key={startup.id} hover className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex flex-col md:flex-row gap-5 items-start">
                {/* Rank + gauge */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-8 h-8 bg-gov-600/20 rounded-full flex items-center justify-center text-xs font-bold text-gov-400">
                    #{i + 1}
                  </div>
                  <SimilarityGauge score={startup.match_score} size={90} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-base font-semibold text-white">{startup.company_name}</h3>
                    <Badge status={startup.verified_status ? 'VERIFIED' : 'PENDING'} label={startup.verified_status ? 'DPIIT Verified' : 'Unverified'} />
                    {startup.match_score >= 0.85 && (
                      <span className="badge badge-active text-[10px]">Top Match</span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-1 font-mono">ID: {startup.dpiit_id}</p>
                  <p className="text-sm text-white/60 mt-3 leading-relaxed">{startup.capability_statement}</p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {startup.tech_stack.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-gov-900/40 border border-gov-700/30 text-gov-300 text-xs rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* AI Rationale */}
                  <div className="mt-4 p-3 bg-cyber-900/20 border border-cyber-700/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Cpu size={12} className="text-cyber-400" />
                      <span className="text-xs text-cyber-400 font-medium">AI Rationale</span>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">{startup.match_rationale}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col gap-2 shrink-0">
                  <button className="btn-primary text-xs px-4 py-2">
                    <CheckCircle size={13} /> Shortlist
                  </button>
                  <button className="btn-secondary text-xs px-4 py-2">
                    <ExternalLink size={13} /> Profile
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && (
        <Card className="py-20 text-center">
          <Cpu size={48} className="mx-auto text-white/10 mb-4" />
          <p className="text-white/30">Select a challenge and run the AI engine to see matches.</p>
        </Card>
      )}
    </div>
  );
}
