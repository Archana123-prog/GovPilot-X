import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import useAppStore from '@store/useAppStore';
import clsx from 'clsx';

export default function AppShell() {
  const { sidebarOpen } = useAppStore();
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <Sidebar />
      <main className={clsx(
        'pt-16 min-h-screen transition-all duration-300',
        sidebarOpen ? 'ml-56' : 'ml-[60px]'
      )}>
        <div className="p-6 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
