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
import { TaskManager } from './TaskManager';
import { ActivityHeatmap } from './ActivityHeatmap';
import { ClientHistory } from './ClientHistory';
import { QuotePreview } from './QuotePreview';
import { InvoiceManager } from './InvoiceManager';
import { LeadSourceAnalytics } from './LeadSourceAnalytics';
import { PerformanceKPI } from './PerformanceKPI';
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
  tasks: TaskManager,
  activity: ActivityHeatmap,
  'client-history': ClientHistory,
  'quote-preview': QuotePreview,
  invoices: InvoiceManager,
  'lead-sources': LeadSourceAnalytics,
  'performance-kpi': PerformanceKPI,
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
