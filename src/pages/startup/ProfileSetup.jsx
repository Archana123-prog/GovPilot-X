import { useState } from 'react';
import { CheckCircle, User, Shield, Code2, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import Card from '@components/ui/Card';
import Input from '@components/ui/Input';
import FileUpload from '@components/ui/FileUpload';
import Button from '@components/ui/Button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const STEPS = [
  { id: 1, label: 'Company Info',       icon: User     },
  { id: 2, label: 'DPIIT Verification', icon: Shield   },
  { id: 3, label: 'Tech Stack',         icon: Code2    },
  { id: 4, label: 'Capability',         icon: FileText },
];

const TECH_POOL = ['React', 'Vue', 'Python', 'FastAPI', 'Node.js', 'TensorFlow', 'PyTorch', 'IoT', 'Computer Vision', 'NLP', 'GCP', 'AWS', 'PostgreSQL', 'MongoDB', 'Blockchain', 'Edge AI'];

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: 'NeoUrban Tech Pvt. Ltd.',
    dpiit_id: 'DIPP12345',
    website: 'https://neourban.in',
    founded: '2021',
    team_size: '28',
    tech_stack: ['Python', 'TensorFlow', 'IoT', 'GCP'],
    capability_statement: '',
    dpiit_file: null,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleTech = (t) =>
    set('tech_stack', form.tech_stack.includes(t)
      ? form.tech_stack.filter((x) => x !== t)
      : [...form.tech_stack, t]);

  const next = () => { if (step < 4) setStep(s => s + 1); };
  const prev = () => { if (step > 1) setStep(s => s - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Profile saved successfully!');
    navigate('/startup');
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div>
        <h1 className="section-heading">Startup Profile</h1>
        <p className="section-subheading">Complete your Procurement Passport</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <button onClick={() => setStep(s.id)}
              className={clsx(
                'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all shrink-0',
                step === s.id ? 'bg-gov-600/20 text-gov-300 border border-gov-500/30' :
                s.id < step   ? 'text-accent-green' : 'text-white/30'
              )}>
              {s.id < step
                ? <CheckCircle size={14} className="text-accent-green" />
                : <s.icon size={14} />}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 ${s.id < step ? 'bg-accent-green/40' : 'bg-surface-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <Card className="animate-slide-up" key={step}>
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white mb-4">Company Information</h2>
            <Input label="Company Name" value={form.company_name} onChange={e => set('company_name', e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Founded Year" type="number" value={form.founded} onChange={e => set('founded', e.target.value)} />
              <Input label="Team Size" type="number" value={form.team_size} onChange={e => set('team_size', e.target.value)} />
            </div>
            <Input label="Website" type="url" value={form.website} onChange={e => set('website', e.target.value)} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white mb-4">DPIIT Verification</h2>
            <Input
              label="DPIIT / DIPP Number"
              value={form.dpiit_id}
              onChange={e => set('dpiit_id', e.target.value)}
              hint="Find your DIPP number on the DPIIT startup portal"
            />
            <FileUpload
              label="Certificate Upload"
              accept=".pdf,.jpg,.png"
              hint="Upload DPIIT recognition certificate (PDF or image)"
              onFile={(f) => set('dpiit_file', f)}
            />
            <div className="p-3 bg-accent-green/10 border border-accent-green/20 rounded-xl">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-accent-green" />
                <p className="text-xs text-accent-green font-medium">Automatic verification within 24 hours</p>
              </div>
              <p className="text-xs text-white/40 mt-1 ml-5">Verified startups bypass EMD and turnover requirements on all tenders.</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white mb-1">Technology Stack</h2>
            <p className="text-xs text-white/40 mb-4">Select all technologies your team works with. Used to compute AI match scores.</p>
            <div className="flex flex-wrap gap-2">
              {TECH_POOL.map(t => (
                <button key={t} type="button" onClick={() => toggleTech(t)}
                  className={clsx(
                    'px-3 py-1.5 rounded-xl text-xs font-medium transition-all border',
                    form.tech_stack.includes(t)
                      ? 'bg-gov-500/20 text-gov-300 border-gov-500/50'
                      : 'bg-surface-hover text-white/50 border-surface-border hover:border-gov-700'
                  )}>
                  {t}
                </button>
              ))}
            </div>
            <p className="text-xs text-white/30">{form.tech_stack.length} technologies selected</p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white mb-4">Capability Statement</h2>
            <Input
              label="Describe Your Startup's Capabilities"
              textArea
              rows={8}
              placeholder="Describe what your startup does, your proven use cases, technologies, geographic reach, and why you're uniquely positioned to solve government challenges. Be specific — this text is embedded for AI matching."
              value={form.capability_statement}
              onChange={e => set('capability_statement', e.target.value)}
            />
            <div className="flex items-start gap-2 p-3 bg-gov-900/20 border border-gov-700/20 rounded-xl">
              <FileText size={13} className="text-gov-400 mt-0.5 shrink-0" />
              <p className="text-xs text-white/40">
                This statement is vectorized using <span className="text-gov-300">text-embedding-3-small</span> and stored in pgvector for semantic similarity matching against challenge descriptions.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={prev} disabled={step === 1} icon={ChevronLeft}>
          Previous
        </Button>
        {step < 4
          ? <Button onClick={next} icon={ChevronRight}>Next Step</Button>
          : <Button loading={loading} onClick={handleSubmit}>
              <CheckCircle size={16} /> Save Profile
            </Button>
        }
      </div>
    </div>
  );
}
