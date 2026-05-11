'use client';

import { useAppStore } from '@/lib/store';
import LoginScreen from './LoginScreen';
import DashboardLayout from './DashboardLayout';
import OverviewTab from './OverviewTab';
import LeadsTab from './LeadsTab';
import AppointmentsTab from './AppointmentsTab';
import ProjectsTab from './ProjectsTab';
import QuotesTab from './QuotesTab';
import FunnelTab from './FunnelTab';
import AnalyticsTab from './AnalyticsTab';
import RevenueDashboard from './RevenueDashboard';
import SiteAuditTab from './SiteAuditTab';
import SettingsTab from './SettingsTab';

const tabComponents: Record<string, React.ComponentType> = {
  overview: OverviewTab,
  leads: LeadsTab,
  appointments: AppointmentsTab,
  projects: ProjectsTab,
  quotes: QuotesTab,
  funnel: FunnelTab,
  analytics: AnalyticsTab,
  revenue: RevenueDashboard,
  'site-audit': SiteAuditTab,
  settings: SettingsTab,
};

export function OwnerDashboard() {
  const { isOwnerAuth, dashboardTab } = useAppStore();

  if (!isOwnerAuth) {
    return <LoginScreen />;
  }

  const ActiveTab = tabComponents[dashboardTab] || OverviewTab;

  return (
    <DashboardLayout>
      <ActiveTab />
    </DashboardLayout>
  );
}
