import { useState } from 'react';
import { Upload, CheckCircle, Clock, FileText, AlertCircle } from 'lucide-react';
import Card from '@components/ui/Card';
import Input from '@components/ui/Input';
import FileUpload from '@components/ui/FileUpload';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import { getChallenges } from '@api/challenges';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const SUBMISSIONS = [
  { id: 1, challenge: 'AI-Powered Smart Waste Management', submitted: '2026-08-10', status: 'REVIEW',    score: 94 },
  { id: 2, challenge: 'Citizen Grievance Chatbot',         submitted: '2026-07-25', status: 'COMPLETED', score: 87 },
];

export default function PitchUpload() {
  const [challenges, setChallenges] = useState([]);
  const [form, setForm] = useState({ challenge_id: '', pitch_summary: '', file: null });
  const [loading, setLoading]       = useState(false);

  useEffect(() => { getChallenges().then(setChallenges); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.challenge_id) return toast.error('Please select a challenge.');
    if (!form.file)         return toast.error('Please upload your pitch deck.');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    toast.success('Pitch submitted! The AI engine will evaluate it within 2 hours.');
    setForm({ challenge_id: '', pitch_summary: '', file: null });
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h1 className="section-heading">Submit Pitch</h1>
        <p className="section-subheading">Upload your deck for AI-powered RAG evaluation against challenge KPIs</p>
      </div>

      {/* Submission form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="input-label">Select Challenge</label>
            <select
              value={form.challenge_id}
              onChange={e => setForm(f => ({ ...f, challenge_id: e.target.value }))}
              className="input-field"
            >
              <option value="">Choose a challenge to apply for…</option>
              {challenges.filter(c => c.status === 'ACTIVE').map(c => (
                <option key={c.id} value={c.id}>{c.title} — ₹{(c.pilot_budget / 1e5).toFixed(0)}L</option>
              ))}
            </select>
          </div>

          <FileUpload
            label="Pitch Deck"
            accept=".pdf,.pptx,.ppt"
            hint="PDF or PowerPoint · Max 50MB · Include your solution approach, team, and deployment plan"
            onFile={(f) => setForm(prev => ({ ...prev, file: f }))}
          />

          <Input
            label="Executive Summary (Optional)"
            textArea
            rows={4}
            placeholder="Briefly summarize your proposed solution, key differentiators, and how you meet the challenge KPIs. This supplements your pitch deck in the AI evaluation."
            value={form.pitch_summary}
            onChange={e => setForm(f => ({ ...f, pitch_summary: e.target.value }))}
          />

          {/* RAG evaluation info */}
          <div className="p-4 bg-gov-900/20 border border-gov-700/20 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-gov-400" />
              <span className="text-xs text-gov-300 font-medium">How RAG Evaluation Works</span>
            </div>
            <ul className="text-xs text-white/40 space-y-1 ml-5 list-disc">
              <li>Your pitch deck is parsed and chunked into semantic sections</li>
              <li>Each chunk is compared against challenge KPI criteria using vector similarity</li>
              <li>GPT-4o synthesizes a scored evaluation with justification per KPI</li>
              <li>Departments receive a structured match report within 2 hours</li>
            </ul>
          </div>

          <Button type="submit" loading={loading} className="w-full py-3 text-base">
            <Upload size={18} /> Submit Pitch for AI Evaluation
          </Button>
        </form>
      </Card>

      {/* Past submissions */}
      <div>
        <h2 className="text-base font-semibold text-white mb-3">Past Submissions</h2>
        <div className="space-y-3">
          {SUBMISSIONS.map(s => (
            <Card key={s.id} hover>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-surface-hover rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-white/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{s.challenge}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <Clock size={10} /> {s.submitted}
                    </span>
                    <span className="text-xs text-cyber-400 font-medium">AI Score: {s.score}%</span>
                  </div>
                </div>
                <Badge status={s.status} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
