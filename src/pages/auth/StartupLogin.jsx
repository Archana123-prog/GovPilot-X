import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket, Lock, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import useAppStore from '@store/useAppStore';
import toast from 'react-hot-toast';

export default function StartupLogin() {
  const { login } = useAppStore();
  const navigate  = useNavigate();
  const [form, setForm] = useState({ email: 'ceo@neourban.in', password: '' });
  const [show, setShow]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login('startup');
    toast.success('Welcome back, NeoUrban Tech!');
    navigate('/startup');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 hero-grid opacity-40" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyber-800/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="glass rounded-3xl p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-cyber-600 to-cyber-400 rounded-2xl
                            flex items-center justify-center mb-4 shadow-glow-cyan">
              <Rocket size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">Startup Portal</h1>
            <p className="text-white/50 text-sm mt-1">Sign in with your startup credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Startup Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-9" placeholder="ceo@startup.in" />
              </div>
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={show ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-9 pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-cyber w-full py-3 text-base mt-2">
              {loading ? (
                <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg> Signing in…</>
              ) : 'Sign In to Startup Portal'}
            </button>
          </form>

          <div className="mt-5 p-3 bg-cyber-900/20 border border-cyber-700/20 rounded-xl text-center">
            <p className="text-xs text-white/40">Demo: use any password to proceed</p>
          </div>

          <p className="text-center text-xs text-white/30 mt-5">
            Government department?{' '}
            <Link to="/login/department" className="text-gov-400 hover:text-gov-300 transition-colors">
              Department Portal →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
