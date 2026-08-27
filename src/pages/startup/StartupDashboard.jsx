import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Search, Upload, TrendingUp, CheckCircle, ArrowRight, Star } from 'lucide-react';
import Card, { CardHeader } from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import SimilarityGauge from '@components/ui/SimilarityGauge';
import { getChallenges } from '@api/challenges';
import useAppStore from '@store/useAppStore';

export default function StartupDashboard() {
  const { user } = useAppStore();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChallenges().then((d) => { setChallenges(d); setLoading(false); });
  }, []);

  const profileSteps = [
    { label: 'Company Info',        done: true  },
    { label: 'DPIIT Verification',  done: true  },
    { label: 'Tech Stack',          done: true  },
    { label: 'Capability Statement',done: true  },
    { label: 'Pitch Deck Upload',   done: false },
  ];
  const profilePct = Math.round((profileSteps.filter(s => s.done).length / profileSteps.length) * 100);

  const mockMatches = [
    { challenge_title: 'AI-Powered Smart Waste Management', score: 0.94, status: 'ACTIVE' },
    { challenge_title: 'Pothole Detection & Road Quality',  score: 0.82, status: 'ACTIVE' },
    { challenge_title: 'Predictive Water Leakage Analytics',score: 0.79, status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-heading">Startup Dashboard</h1>
          <p className="section-subheading">Welcome, {user?.name}</p>
        </div>
        {user?.verified && (
          <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
            <Shield size={15} className="text-accent-green" />
            <span className="text-xs text-accent-green font-medium">DPIIT Verified</span>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Profile Complete', value: `${profilePct}%`, color: 'text-gov-400',      bg: 'bg-gov-500/10',       icon: CheckCircle },
          { label: 'Matched Challenges', value: mockMatches.length, color: 'text-cyber-400',  bg: 'bg-cyber-500/10',   icon: Star        },
          { label: 'Active Pilots',   value: 1, color: 'text-accent-green', bg: 'bg-accent-green/10', icon: TrendingUp },
          { label: 'Pitches Submitted', value: 2, color: 'text-accent-amber', bg: 'bg-accent-amber/10', icon: Upload   },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon size={18} className={s.color} />
            </div>
            <p className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile completeness */}
        <Card>
          <CardHeader title="Profile Completeness" subtitle={`${profilePct}% complete`} />
          <div className="mb-4">
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>Progress</span><span>{profilePct}%</span>
            </div>
            <div className="h-2 bg-surface-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gov-600 to-cyber-500 rounded-full transition-all duration-700"
                   style={{ width: `${profilePct}%` }} />
            </div>
          </div>
          <div className="space-y-2">
            {profileSteps.map((s) => (
              <div key={s.label} className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  s.done ? 'bg-accent-green/20' : 'bg-surface-border'
                }`}>
                  {s.done && <CheckCircle size={10} className="text-accent-green" />}
                </div>
                <span className={`text-xs ${s.done ? 'text-white/70' : 'text-white/30'}`}>{s.label}</span>
                {!s.done && <span className="ml-auto text-[10px] text-accent-amber">Pending</span>}
              </div>
            ))}
          </div>
          {profilePct < 100 && (
            <Link to="/startup/pitch" className="btn-primary w-full mt-4 text-sm">
              Complete Profile <ArrowRight size={14} />
            </Link>
          )}
        </Card>

        {/* Top AI matches */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Your Top AI Matches"
              subtitle="Challenges best suited to your capabilities"
              action={
                <Link to="/startup/explore" className="text-xs text-gov-400 hover:text-gov-300 flex items-center gap-1">
                  Explore all <ArrowRight size={12} />
                </Link>
              }
            />
            <div className="space-y-3">
              {mockMatches.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-surface-hover rounded-xl hover:bg-surface-border transition-colors group">
                  <SimilarityGauge score={m.score} size={54} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{m.challenge_title}</p>
                    <Badge status={m.status} className="mt-1.5" />
                  </div>
                  <Link to="/startup/explore" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={14} className="text-cyber-400" />
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader title="Quick Actions" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/startup/profile',  label: 'Edit Profile',    icon: CheckCircle, color: 'text-gov-400 bg-gov-500/10'        },
            { to: '/startup/explore',  label: 'Browse Challenges',icon: Search,     color: 'text-cyber-400 bg-cyber-500/10'    },
            { to: '/startup/pitch',    label: 'Submit Pitch',     icon: Upload,     color: 'text-accent-amber bg-accent-amber/10'},
            { to: '/tracker',          label: 'Pilot Tracker',    icon: TrendingUp, color: 'text-accent-green bg-accent-green/10'},
          ].map((a) => (
            <Link key={a.to} to={a.to}
              className="flex flex-col items-center gap-2 p-4 bg-surface-hover hover:bg-surface-border rounded-xl transition-colors text-center group">
              <div className={`w-10 h-10 ${a.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <a.icon size={18} />
              </div>
              <span className="text-xs text-white/60 font-medium">{a.label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
