import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DollarSign, Calendar, GripVertical, CheckCircle, Clock } from 'lucide-react';
import Badge from '@components/ui/Badge';
import clsx from 'clsx';

export default function MilestoneCard({ milestone, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: milestone.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const kpiCount = Object.keys(milestone.kpi_criteria || {}).length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'glass rounded-xl p-4 cursor-pointer select-none transition-all duration-200',
        'hover:border-gov-500/30 hover:shadow-glow-sm',
        isDragging && 'opacity-60 shadow-glow-md scale-105 rotate-1'
      )}
      onClick={() => !isDragging && onClick?.(milestone)}
    >
      {/* Drag handle + title */}
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 transition-colors shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white leading-snug">{milestone.milestone_title}</p>
          <p className="text-[11px] text-white/40 mt-0.5 truncate">{milestone.startup_name}</p>
        </div>
      </div>

      {/* Challenge */}
      <p className="text-[11px] text-white/30 mt-2 truncate">
        🏛 {milestone.challenge_title}
      </p>

      {/* Payout */}
      <div className="flex items-center gap-1 mt-3">
        <DollarSign size={12} className="text-accent-green" />
        <span className="text-sm font-semibold text-accent-green">
          ₹{(milestone.payout_amount / 1e5).toFixed(1)}L
        </span>
      </div>

      {/* KPI count */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="text-[10px] text-white/30 bg-surface-hover px-2 py-0.5 rounded-full">
          {kpiCount} KPI{kpiCount !== 1 ? 's' : ''}
        </span>
        {milestone.completed_at && (
          <span className="text-[10px] text-accent-green flex items-center gap-1">
            <CheckCircle size={9} /> {new Date(milestone.completed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>
    </div>
  );
}
