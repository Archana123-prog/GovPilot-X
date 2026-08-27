import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, List, Cpu, User, Search, Upload,
  Activity, ChevronLeft, ChevronRight, Zap,
} from 'lucide-react';
import useAppStore from '@store/useAppStore';
import clsx from 'clsx';

const DEPT_NAV = [
  { to: '/department', icon: LayoutDashboard, label: 'Dashboard',   end: true },
  { to: '/department/challenges', icon: List,  label: 'Challenges'  },
  { to: '/department/create',     icon: PlusCircle, label: 'Post Challenge' },
  { to: '/department/matches',    icon: Cpu,   label: 'AI Matches'  },
];

const STARTUP_NAV = [
  { to: '/startup',             icon: LayoutDashboard, label: 'Dashboard',  end: true },
  { to: '/startup/profile',     icon: User,     label: 'My Profile'  },
  { to: '/startup/explore',     icon: Search,   label: 'Explore Challenges' },
  { to: '/startup/pitch',       icon: Upload,   label: 'Submit Pitch' },
];

const SHARED_NAV = [
  { to: '/tracker', icon: Activity, label: 'Pilot Tracker' },
];

export default function Sidebar() {
  const { role, sidebarOpen, toggleSidebar } = useAppStore();
  const navItems = role === 'department' ? DEPT_NAV : STARTUP_NAV;

  return (
    <aside
      className={clsx(
        'fixed left-0 top-16 bottom-0 z-30 flex flex-col',
        'border-r border-surface-border bg-surface-overlay/95 backdrop-blur-xl',
        'transition-all duration-300 ease-in-out',
        sidebarOpen ? 'w-56' : 'w-[60px]'
      )}
    >
      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 w-6 h-6 bg-surface-card border border-surface-border
                   rounded-full flex items-center justify-center text-white/40 hover:text-white
                   transition-colors z-10"
      >
        {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>

      <nav className="flex-1 overflow-y-auto p-3 pt-4 space-y-1">
        {/* Role label */}
        {sidebarOpen && (
          <p className="text-[10px] uppercase tracking-widest text-white/25 px-3 mb-3 font-medium">
            {role === 'department' ? 'Department Portal' : 'Startup Portal'}
          </p>
        )}

        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => clsx(
              isActive ? 'nav-item-active' : 'nav-item',
              !sidebarOpen && 'justify-center px-2'
            )}
            title={!sidebarOpen ? label : undefined}
          >
            <Icon size={17} className="shrink-0" />
            {sidebarOpen && <span className="truncate">{label}</span>}
          </NavLink>
        ))}

        {/* Divider */}
        <div className="divider !my-3" />

        {/* Shared nav */}
        {sidebarOpen && (
          <p className="text-[10px] uppercase tracking-widest text-white/25 px-3 mb-2 font-medium">Shared</p>
        )}
        {SHARED_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => clsx(
              isActive ? 'nav-item-active' : 'nav-item',
              !sidebarOpen && 'justify-center px-2'
            )}
            title={!sidebarOpen ? label : undefined}
          >
            <Icon size={17} className="shrink-0" />
            {sidebarOpen && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom badge */}
      {sidebarOpen && (
        <div className="p-3 border-t border-surface-border">
          <div className="glass rounded-xl p-3 flex items-center gap-2">
            <Zap size={14} className="text-gov-400 shrink-0" />
            <div>
              <p className="text-[11px] text-white/60 leading-none">AI Engine</p>
              <p className="text-[10px] text-accent-green mt-0.5">● Active</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
