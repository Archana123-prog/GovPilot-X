import { useState } from 'react';
import { DollarSign, CheckCircle, Clock, X, ChevronRight } from 'lucide-react';
import Modal from '@components/ui/Modal';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import { updateMilestoneStatus } from '@api/milestones';
import toast from 'react-hot-toast';

const STATUSES = ['PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];

export default function MilestoneModal({ milestone, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false);

  if (!milestone) return null;

  const currentIdx  = STATUSES.indexOf(milestone.status);
  const nextStatus  = STATUSES[currentIdx + 1];

  const handleAdvance = async () => {
    if (!nextStatus) return;
    setLoading(true);
    const updated = await updateMilestoneStatus(milestone.id, nextStatus);
    toast.success(`Milestone moved to ${nextStatus.replace('_', ' ')}`);
    onUpdated?.(updated);
    setLoading(false);
    onClose();
  };

  return (
    <Modal open={!!milestone} onClose={onClose} title="Milestone Detail" size="md">
      <div className="space-y-4">
        {/* Title & badge */}
        <div>
          <h3 className="text-base font-semibold text-white">{milestone.milestone_title}</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge status={milestone.status} />
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-surface-hover rounded-xl">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Startup</p>
            <p className="text-sm text-white font-medium">{milestone.startup_name}</p>
          </div>
          <div className="p-3 bg-surface-hover rounded-xl">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Payout</p>
            <p className="text-sm text-accent-green font-semibold flex items-center gap-1">
              <DollarSign size={12} /> ₹{(milestone.payout_amount / 1e5).toFixed(1)}L
            </p>
          </div>
        </div>

        {/* Challenge */}
        <div className="p-3 bg-surface-hover rounded-xl">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Challenge</p>
          <p className="text-sm text-white">{milestone.challenge_title}</p>
        </div>

        {/* KPIs */}
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">KPI Criteria</p>
          <div className="space-y-2">
            {Object.entries(milestone.kpi_criteria || {}).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between p-2.5 bg-surface-card rounded-xl border border-surface-border">
                <span className="text-xs text-white/60 capitalize">{k.replace(/_/g, ' ')}</span>
                <span className="text-xs font-semibold text-white">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Advance status */}
        {nextStatus && (
          <div className="pt-2 border-t border-surface-border">
            <Button onClick={handleAdvance} loading={loading} className="w-full">
              <ChevronRight size={16} />
              Advance to {nextStatus.replace('_', ' ')}
            </Button>
          </div>
        )}
        {!nextStatus && (
          <div className="flex items-center gap-2 p-3 bg-accent-green/10 border border-accent-green/20 rounded-xl">
            <CheckCircle size={16} className="text-accent-green" />
            <p className="text-sm text-accent-green font-medium">Milestone completed</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
