// Radial SVG gauge showing AI similarity score
export default function SimilarityGauge({ score = 0, size = 100 }) {
  const pct = Math.min(Math.max(score, 0), 1);
  const pctDisplay = Math.round(pct * 100);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct);

  const color = pct >= 0.85 ? '#10b981' : pct >= 0.78 ? '#22d3ee' : pct >= 0.6 ? '#f59e0b' : '#ef4444';
  const label = pct >= 0.85 ? 'Excellent' : pct >= 0.78 ? 'Strong' : pct >= 0.6 ? 'Moderate' : 'Weak';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox="0 0 100 100">
        {/* Track */}
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#1e1e35" strokeWidth="8" />
        {/* Progress */}
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease', filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
        {/* Text */}
        <text x="50" y="46" textAnchor="middle" fill="white" fontSize="16" fontWeight="700" fontFamily="Space Grotesk">
          {pctDisplay}%
        </text>
        <text x="50" y="60" textAnchor="middle" fill={color} fontSize="8" fontWeight="500" fontFamily="Inter">
          {label}
        </text>
      </svg>
    </div>
  );
}
