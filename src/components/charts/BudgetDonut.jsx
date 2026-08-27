import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f59e0b', '#a855f7'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs">
      <p className="font-medium text-white">{payload[0].name}</p>
      <p className="text-white/60">₹{(payload[0].value / 1e5).toFixed(1)}L</p>
    </div>
  );
};

export default function BudgetDonut({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(v) => <span className="text-xs text-white/60">{v}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: '-14px' }}>
        <p className="text-xl font-bold text-white font-display">₹{(total / 1e5).toFixed(0)}L</p>
        <p className="text-xs text-white/40">Total Budget</p>
      </div>
    </div>
  );
}
