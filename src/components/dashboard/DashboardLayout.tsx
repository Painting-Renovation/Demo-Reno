'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore, DASHBOARD_TABS } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Paintbrush,
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  Filter,
  BarChart3,
  ShieldCheck,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  UserPlus,
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  Filter,
  BarChart3,
  ShieldCheck,
  Settings,
};

interface QuickStats {
  totalLeads: number;
  activeProjects: number;
  pendingAppointments: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { dashboardTab, setDashboardTab, logout, setView } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ownerName, setOwnerName] = useState('Owner');
  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalLeads: 0,
    activeProjects: 0,
    pendingAppointments: 0,
  });

  useEffect(() => {
    fetch('/api/owner')
      .then((res) => res.json())
      .then((data) => {
        if (data.name) setOwnerName(data.name);
      })
      .catch(() => {});

    fetch('/api/analytics?period=month')
      .then((res) => res.json())
      .then((data) => {
        if (data.kpis) {
          setQuickStats({
            totalLeads: data.kpis.totalLeads || 0,
            activeProjects: data.kpis.activeProjects || 0,
            pendingAppointments: data.kpis.pendingAppointments || 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleNavClick = useCallback((tabId: string) => {
    setDashboardTab(tabId);
    setSidebarOpen(false);
  }, [setDashboardTab]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleBackToWebsite = useCallback(() => {
    setView('public');
  }, [setView]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy">
          <Paintbrush className="h-5 w-5 text-gold" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-navy truncate">ProCoat Painters</h2>
          <p className="text-xs text-muted-foreground">Management Portal</p>
        </div>
      </div>

      <Separator />

      {/* Nav Items */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {DASHBOARD_TABS.map((tab) => {
            const IconComponent = iconMap[tab.icon] || LayoutDashboard;
            const isActive = dashboardTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gold/10 text-gold border-l-2 border-gold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <IconComponent className={cn('h-4 w-4 shrink-0', isActive && 'text-gold')} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Bottom Actions */}
      <div className="space-y-2 p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sm text-muted-foreground hover:text-foreground"
          onClick={handleBackToWebsite}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Website
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-white shrink-0">
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                {sidebarContent}
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="text-lg font-semibold text-navy">Welcome back, {ownerName}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Quick Stats & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 mr-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <UserPlus className="h-3.5 w-3.5" />
                <span className="font-medium text-navy">{quickStats.totalLeads}</span> leads
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ClipboardList className="h-3.5 w-3.5" />
                <span className="font-medium text-navy">{quickStats.activeProjects}</span> projects
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span className="font-medium text-navy">{quickStats.pendingAppointments}</span> pending
              </div>
            </div>

            {/* Notification Center */}
            <NotificationCenter />

            {/* Avatar */}
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-navy text-white text-xs font-bold">
              {ownerName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
