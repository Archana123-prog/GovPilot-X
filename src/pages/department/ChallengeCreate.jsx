import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Minus, Info, DollarSign, Tag, FileText, Zap } from 'lucide-react';
import Card from '@components/ui/Card';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { createChallenge } from '@api/challenges';
import toast from 'react-hot-toast';

const TECH_OPTIONS = ['AI/ML', 'IoT', 'Blockchain', 'Computer Vision', 'NLP', 'GIS', 'Data Analytics', 'Cloud', 'Robotics', 'Edge Computing'];

export default function ChallengeCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    pilot_budget: 1000000,
    tags: [],
    kpis: [{ metric: '', target: '', unit: '' }],
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleTag = (tag) =>
    set('tags', form.tags.includes(tag) ? form.tags.filter((t) => t !== tag) : [...form.tags, tag]);

  const setKpi = (i, key, val) =>
    set('kpis', form.kpis.map((k, idx) => idx === i ? { ...k, [key]: val } : k));

  const addKpi = () => set('kpis', [...form.kpis, { metric: '', target: '', unit: '' }]);
  const removeKpi = (i) => set('kpis', form.kpis.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return toast.error('Title and description are required.');
    setLoading(true);
    try {
      await createChallenge({ ...form, department_id: 'dept-001' });
      toast.success('Challenge posted successfully!');
      navigate('/department/challenges');
    } catch {
      toast.error('Failed to post challenge. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h1 className="section-heading">Post a Challenge</h1>
        <p className="section-subheading">Define your problem statement for AI-powered startup matching</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <FileText size={16} className="text-gov-400" />
            <h2 className="text-sm font-semibold text-white">Challenge Details</h2>
          </div>
          <div className="space-y-4">
            <Input
              label="Challenge Title"
              placeholder="e.g. AI-Powered Smart Waste Management System"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
            />
            <Input
              label="Problem Description"
              placeholder="Describe the civic problem in detail. Include context, current pain points, and expected outcomes. The more specific, the better the AI match quality."
              textArea
              rows={5}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              required
            />
          </div>
        </Card>

        {/* Budget */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <DollarSign size={16} className="text-cyber-400" />
            <h2 className="text-sm font-semibold text-white">Pilot Budget</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Budget Amount</span>
              <span className="text-lg font-display font-bold text-white">
                ₹{(form.pilot_budget / 1e5).toFixed(1)}L
              </span>
            </div>
            <input
              type="range"
              min={100000}
              max={10000000}
              step={100000}
              value={form.pilot_budget}
              onChange={(e) => set('pilot_budget', Number(e.target.value))}
              className="w-full h-2 bg-surface-border rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                         [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-gov-500 [&::-webkit-slider-thumb]:shadow-glow-sm
                         accent-gov-500"
            />
            <div className="flex justify-between text-xs text-white/30">
              <span>₹1L</span><span>₹50L</span><span>₹100L</span>
            </div>
          </div>
        </Card>

        {/* Tech tags */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <Tag size={16} className="text-accent-purple" />
            <h2 className="text-sm font-semibold text-white">Technology Tags</h2>
            <span className="text-xs text-white/30 ml-auto">Used for AI matching</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TECH_OPTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  form.tags.includes(tag)
                    ? 'bg-gov-500/20 text-gov-300 border border-gov-500/50'
                    : 'bg-surface-hover text-white/50 border border-surface-border hover:border-gov-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </Card>

        {/* KPI criteria */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-accent-green" />
              <h2 className="text-sm font-semibold text-white">KPI Success Criteria</h2>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={addKpi} icon={PlusCircle}>
              Add KPI
            </Button>
          </div>
          <div className="space-y-3">
            {form.kpis.map((kpi, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input placeholder="Metric" value={kpi.metric} onChange={(e) => setKpi(i, 'metric', e.target.value)}
                  className="input-field flex-[2] text-xs" />
                <input placeholder="Target" value={kpi.target} onChange={(e) => setKpi(i, 'target', e.target.value)}
                  className="input-field flex-1 text-xs" />
                <input placeholder="Unit" value={kpi.unit} onChange={(e) => setKpi(i, 'unit', e.target.value)}
                  className="input-field flex-1 text-xs" />
                {form.kpis.length > 1 && (
                  <button type="button" onClick={() => removeKpi(i)}
                    className="p-2 text-accent-red/60 hover:text-accent-red transition-colors shrink-0">
                    <Minus size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 mt-4 p-3 bg-gov-900/20 rounded-xl border border-gov-700/20">
            <Info size={14} className="text-gov-400 mt-0.5 shrink-0" />
            <p className="text-xs text-white/40">
              KPI criteria are used by the RAG engine to score startup pitch decks against your challenge requirements.
            </p>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <Button type="submit" loading={loading} className="flex-1 py-3 text-base">
            <PlusCircle size={18} />
            Post Challenge
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)} className="px-6">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
