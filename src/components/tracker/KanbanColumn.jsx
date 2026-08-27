import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import MilestoneCard from './MilestoneCard';
import clsx from 'clsx';

const COL_CONFIG = {
  PENDING:     { label: 'Pending',     color: 'border-accent-amber/30', dot: 'bg-accent-amber',  count_color: 'text-accent-amber'  },
  IN_PROGRESS: { label: 'In Progress', color: 'border-gov-500/30',      dot: 'bg-gov-400',       count_color: 'text-gov-400'       },
  REVIEW:      { label: 'Under Review',color: 'border-accent-purple/30', dot: 'bg-accent-purple', count_color: 'text-accent-purple' },
  COMPLETED:   { label: 'Completed',   color: 'border-accent-green/30', dot: 'bg-accent-green',  count_color: 'text-accent-green'  },
};

export default function KanbanColumn({ status, items, onCardClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const cfg = COL_CONFIG[status];

  return (
    <div className="flex flex-col min-w-[260px] flex-1">
      {/* Column header */}
      <div className={clsx(
        'flex items-center gap-2 px-3 py-2 rounded-xl mb-3 border',
        'bg-surface-card',
        cfg.color
      )}>
        <span className={clsx('w-2 h-2 rounded-full', cfg.dot)} />
        <span className="text-sm font-medium text-white">{cfg.label}</span>
        <span className={clsx('ml-auto text-xs font-bold', cfg.count_color)}>
          {items.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={clsx(
          'flex-1 rounded-2xl p-3 min-h-[400px] transition-all duration-200',
          isOver
            ? 'bg-gov-900/30 border-2 border-dashed border-gov-500/50'
            : 'bg-surface-card/40 border border-surface-border'
        )}
      >
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((m) => (
              <MilestoneCard key={m.id} milestone={m} onClick={onCardClick} />
            ))}
          </div>
        </SortableContext>

        {items.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p className="text-xs text-white/20 text-center py-8">
              Drop milestones here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
