import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  // Auth / Role
  user: null,
  role: null,          // 'department' | 'startup' | null
  isAuthenticated: false,

  // UI
  sidebarOpen: true,
  notifications: [],

  // Mock login
  login: (role) => {
    const mockUser = {
      department: { id: 'dept-001', name: 'Ministry of Urban Development', email: 'admin@mud.gov.in', avatar: 'MU' },
      startup:    { id: 'startup-001', name: 'NeoUrban Tech Pvt. Ltd.', email: 'ceo@neourban.in', avatar: 'NT', dpiit_id: 'DIPP12345', verified: true },
    };
    set({ user: mockUser[role], role, isAuthenticated: true });
  },

  logout: () => set({ user: null, role: null, isAuthenticated: false }),

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  addNotification: (n) =>
    set((s) => ({ notifications: [{ id: Date.now(), ...n }, ...s.notifications].slice(0, 20) })),

  clearNotifications: () => set({ notifications: [] }),
}));

export default useAppStore;
