import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, TrendingUp, Users, Zap, Clock, ArrowRight } from 'lucide-react';
import Card, { CardHeader } from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import BudgetDonut from '@components/charts/BudgetDonut';
import { getChallenges } from '@api/challenges';
import useAppStore from '@store/useAppStore';

const BUDGET_DATA = [
  { name: 'Smart City', value: 2500000 },
  { name: 'Infrastructure', value: 1800000 },
  { name: 'Governance', value: 950000 },
  { name: 'Water Mgmt', value: 3200000 },
];

export default function DepartmentDashboard() {
  const { user } = useAppStore();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChallenges().then((d) => { setChallenges(d); setLoading(false); });
  }, []);

  const stats = [
    { label: 'Active Challenges',  value: challenges.filter(c => c.status === 'ACTIVE').length, icon: Zap,       color: 'text-gov-400',    bg: 'bg-gov-500/10'    },
    { label: 'Total Applications', value: challenges.reduce((s, c) => s + c.applications, 0),   icon: Users,     color: 'text-cyber-400',  bg: 'bg-cyber-500/10'  },
    { label: 'AI Matches Made',    value: challenges.reduce((s, c) => s + c.match_count, 0),    icon: TrendingUp, color: 'text-accent-green', bg: 'bg-accent-green/10' },
    { label: 'Under Review',       value: challenges.filter(c => c.status === 'REVIEW').length,  icon: Clock,     color: 'text-accent-amber', bg: 'bg-accent-amber/10' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-heading">Dashboard</h1>
          <p className="section-subheading">Welcome back, {user?.name}</p>
        </div>
        <Link to="/department/create" className="btn-primary">
          <PlusCircle size={16} /> Post Challenge
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon size={18} className={s.color} />
            </div>
            <p className={`text-3xl font-display font-bold ${s.color}`}>{loading ? '—' : s.value}</p>
            <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent challenges */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Recent Challenges"
              subtitle="Your department's posted challenges"
              action={
                <Link to="/department/challenges" className="text-xs text-gov-400 hover:text-gov-300 flex items-center gap-1">
                  View all <ArrowRight size={12} />
                </Link>
              }
            />
            <div className="space-y-3">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="shimmer h-16 rounded-xl" />
                  ))
                : challenges.slice(0, 4).map((c) => (
                    <div key={c.id} className="flex items-center gap-3 p-3 bg-surface-hover rounded-xl hover:bg-surface-border transition-colors group">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{c.title}</p>
                        <p className="text-xs text-white/40 mt-0.5">
                          ₹{(c.pilot_budget / 1e5).toFixed(0)}L pilot · {c.applications} applications
                        </p>
                      </div>
                      <Badge status={c.status} />
                      <Link to={`/department/matches?id=${c.id}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight size={14} className="text-gov-400" />
                      </Link>
                    </div>
                  ))}
            </div>
          </Card>
        </div>

        {/* Budget donut */}
        <Card>
          <CardHeader title="Budget Allocation" subtitle="Across active challenges" />
          <BudgetDonut data={BUDGET_DATA} />
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader title="Quick Actions" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/department/create', label: 'New Challenge', icon: PlusCircle, color: 'text-gov-400 bg-gov-500/10' },
            { to: '/department/matches', label: 'Run AI Match', icon: Zap, color: 'text-cyber-400 bg-cyber-500/10' },
            { to: '/tracker', label: 'Pilot Tracker', icon: TrendingUp, color: 'text-accent-green bg-accent-green/10' },
            { to: '/department/challenges', label: 'All Challenges', icon: Clock, color: 'text-accent-amber bg-accent-amber/10' },
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
