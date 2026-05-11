import { create } from 'zustand';

export type AppView = 'public' | 'dashboard';

interface DashboardTab {
  id: string;
  label: string;
  icon: string;
}

export interface AppState {
  currentView: AppView;
  isOwnerAuth: boolean;
  dashboardTab: string;
  mobileMenuOpen: boolean;
  estimateFormOpen: boolean;
  appointmentFormOpen: boolean;
  
  setView: (view: AppView) => void;
  setOwnerAuth: (auth: boolean) => void;
  setDashboardTab: (tab: string) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setEstimateFormOpen: (open: boolean) => void;
  setAppointmentFormOpen: (open: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'public',
  isOwnerAuth: false,
  dashboardTab: 'overview',
  mobileMenuOpen: false,
  estimateFormOpen: false,
  appointmentFormOpen: false,
  
  setView: (view) => set({ currentView: view }),
  setOwnerAuth: (auth) => set({ isOwnerAuth: auth }),
  setDashboardTab: (tab) => set({ dashboardTab: tab }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setEstimateFormOpen: (open) => set({ estimateFormOpen: open }),
  setAppointmentFormOpen: (open) => set({ appointmentFormOpen: open }),
  logout: () => set({ isOwnerAuth: false, currentView: 'public', dashboardTab: 'overview' }),
}));

export const DASHBOARD_TABS: DashboardTab[] = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'leads', label: 'Leads', icon: 'Users' },
  { id: 'appointments', label: 'Appointments', icon: 'Calendar' },
  { id: 'projects', label: 'Projects', icon: 'ClipboardList' },
  { id: 'quotes', label: 'Quotes', icon: 'FileText' },
  { id: 'funnel', label: 'Funnel', icon: 'Filter' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
  { id: 'revenue', label: 'Revenue', icon: 'DollarSign' },
  { id: 'site-audit', label: 'Site Audit', icon: 'ShieldCheck' },
  { id: 'tasks', label: 'Task Manager', icon: 'ListTodo' },
  { id: 'activity', label: 'Activity', icon: 'Activity' },
  { id: 'client-history', label: 'Client History', icon: 'User' },
  { id: 'quote-preview', label: 'Quote Preview', icon: 'FileText' },
  { id: 'invoices', label: 'Invoices', icon: 'Receipt' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
];
