import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, ChevronDown, Zap, Building2, Rocket } from 'lucide-react';
import useAppStore from '@store/useAppStore';
import clsx from 'clsx';

export default function Navbar() {
  const { isAuthenticated, user, role, logout, notifications } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const unread = notifications.length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center px-4 lg:px-6
                       border-b border-surface-border bg-surface-overlay/90 backdrop-blur-xl">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 mr-8 shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-gov-600 to-cyber-500 rounded-lg
                        flex items-center justify-center shadow-glow-sm">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-display font-bold text-white text-lg tracking-tight">
          GovPilot<span className="gradient-text">-X</span>
        </span>
      </Link>

      {/* Center nav (public) */}
      {!isAuthenticated && (
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {[['/', 'Home'], ['/about', 'About'], ['/challenges', 'Challenges']].map(([to, label]) => (
            <Link
              key={to}
              to={to}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                location.pathname === to ? 'text-white bg-white/5' : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            {/* Pilot Tracker link */}
            <Link
              to="/tracker"
              className={clsx(
                'hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                location.pathname.startsWith('/tracker')
                  ? 'text-cyber-300 bg-cyber-500/10'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <Zap size={14} />
              Pilot Tracker
            </Link>

            {/* Notifications */}
            <button className="relative btn-ghost p-2 rounded-lg">
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full" />
              )}
            </button>

            {/* User menu */}
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-1.5 cursor-pointer">
              <div className="w-7 h-7 bg-gradient-to-br from-gov-600 to-cyber-500 rounded-lg
                              flex items-center justify-center text-xs font-bold text-white">
                {user?.avatar}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-medium text-white leading-none">{user?.name}</p>
                <p className="text-[10px] text-white/40 mt-0.5 capitalize">{role} portal</p>
              </div>
              <ChevronDown size={14} className="text-white/40 hidden md:block" />
            </div>

            <button onClick={handleLogout} className="btn-ghost p-2 rounded-lg text-white/40 hover:text-accent-red">
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login/department" className="btn-secondary flex items-center gap-1.5 text-sm">
              <Building2 size={14} />
              <span className="hidden sm:inline">Department</span>
            </Link>
            <Link to="/login/startup" className="btn-primary flex items-center gap-1.5 text-sm">
              <Rocket size={14} />
              <span className="hidden sm:inline">Startup</span>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
