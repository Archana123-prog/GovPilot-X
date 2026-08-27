import { useEffect, useState, useCallback } from 'react';
import {
  DndContext, PointerSensor, useSensor, useSensors,
  DragOverlay, closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Activity, RefreshCw } from 'lucide-react';
import KanbanColumn from '@components/tracker/KanbanColumn';
import MilestoneCard from '@components/tracker/MilestoneCard';
import MilestoneModal from '@components/tracker/MilestoneModal';
import { getMilestones, updateMilestoneStatus } from '@api/milestones';
import toast from 'react-hot-toast';
import useAppStore from '@store/useAppStore';

const COLUMNS = ['PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];

export default function PilotTracker() {
  const { role } = useAppStore();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeMs, setActiveMs]     = useState(null);  // for DragOverlay
  const [modalMs, setModalMs]       = useState(null);  // detail modal

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getMilestones();
    setMilestones(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const byStatus = (status) => milestones.filter((m) => m.status === status);

  const findContainer = (id) => milestones.find((m) => m.id === id)?.status;

  const handleDragStart = ({ active }) => {
    setActiveMs(milestones.find((m) => m.id === active.id) || null);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveMs(null);
    if (!over) return;

    const fromStatus = findContainer(active.id);
    // over.id can be a column id (string) or a card id
    const toStatus = COLUMNS.includes(over.id) ? over.id : findContainer(over.id);

    if (!fromStatus || !toStatus) return;

    if (fromStatus === toStatus) {
      // Reorder within column
      const colItems = byStatus(fromStatus);
      const oldIdx   = colItems.findIndex((m) => m.id === active.id);
      const newIdx   = colItems.findIndex((m) => m.id === over.id);
      if (oldIdx !== newIdx) {
        const reordered = arrayMove(colItems, oldIdx, newIdx);
        setMilestones((prev) => [
          ...prev.filter((m) => m.status !== fromStatus),
          ...reordered,
        ]);
      }
    } else {
      // Move to new column
      setMilestones((prev) =>
        prev.map((m) => m.id === active.id ? { ...m, status: toStatus } : m)
      );
      try {
        await updateMilestoneStatus(active.id, toStatus);
        toast.success(`Moved to ${toStatus.replace('_', ' ')}`);
      } catch {
        toast.error('Failed to update status');
        load(); // revert
      }
    }
  };

  const handleModalUpdate = (updated) => {
    setMilestones((prev) => prev.map((m) => m.id === updated.id ? updated : m));
  };

  const totalPayout = milestones
    .filter(m => m.status === 'COMPLETED')
    .reduce((s, m) => s + m.payout_amount, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-heading flex items-center gap-2">
            <Activity size={22} className="text-gov-400" /> Pilot Tracker
          </h1>
          <p className="section-subheading capitalize">
            {role} view · Drag cards to update milestone status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-white/40">Total Disbursed</p>
            <p className="text-base font-display font-bold text-accent-green">
              ₹{(totalPayout / 1e5).toFixed(1)}L
            </p>
          </div>
          <button onClick={load} className="btn-ghost p-2.5 rounded-xl" title="Refresh">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Kanban board */}
      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((c) => (
            <div key={c} className="min-w-[260px] flex-1 space-y-3">
              <div className="shimmer h-10 rounded-xl" />
              {Array.from({ length: 2 }).map((_, i) => <div key={i} className="shimmer h-32 rounded-xl" />)}
            </div>
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
            {COLUMNS.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                items={byStatus(status)}
                onCardClick={setModalMs}
              />
            ))}
          </div>

          <DragOverlay>
            {activeMs && (
              <div className="rotate-2 scale-105">
                <MilestoneCard milestone={activeMs} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {/* Modal */}
      <MilestoneModal
        milestone={modalMs}
        onClose={() => setModalMs(null)}
        onUpdated={handleModalUpdate}
      />
    </div>
  );
}
