'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  ClipboardList,
  DollarSign,
  TrendingUp,
  TrendingDown,
  UserPlus,
  FileText,
  Phone,
  ArrowRight,
  CalendarPlus,
  Mail,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPI {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
}

interface LeadRow {
  id: string;
  name: string;
  email: string;
  service: string;
  status: string;
  date: string;
}

interface Appointment {
  id: string;
  date: string;
  client: string;
  service: string;
  time: string;
}

interface ActivityItem {
  id: string;
  type: 'lead' | 'appointment' | 'call' | 'message';
  description: string;
  timestamp: string;
  icon: React.ElementType;
  iconColor: string;
}

const getActivityIcon = (status: string): { icon: React.ElementType; color: string } => {
  switch (status) {
    case 'new':
      return { icon: UserPlus, color: 'bg-blue-100 text-blue-600' };
    case 'contacted':
      return { icon: Phone, color: 'bg-amber-100 text-amber-600' };
    case 'qualified':
      return { icon: Mail, color: 'bg-green-100 text-green-600' };
    case 'proposal':
      return { icon: FileText, color: 'bg-purple-100 text-purple-600' };
    case 'won':
      return { icon: CalendarPlus, color: 'bg-emerald-100 text-emerald-600' };
    case 'lost':
      return { icon: MessageSquare, color: 'bg-red-100 text-red-500' };
    default:
      return { icon: Users, color: 'bg-gray-100 text-gray-500' };
  }
};

const getStatusAction = (status: string): string => {
  switch (status) {
    case 'new':
      return 'submitted a new estimate request';
    case 'contacted':
      return 'was contacted by the team';
    case 'qualified':
      return 'was qualified as a potential client';
    case 'proposal':
      return 'received a project proposal';
    case 'won':
      return 'converted to a booked project';
    case 'lost':
      return 'marked as a lost lead';
    default:
      return 'was updated';
  }
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function OverviewTab() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [recentLeads, setRecentLeads] = useState<LeadRow[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [analyticsRes, leadsRes, appointmentsRes] = await Promise.all([
          fetch('/api/analytics?period=month'),
          fetch('/api/leads?limit=5&sort=latest'),
          fetch('/api/appointments?limit=3&status=scheduled'),
        ]);

        const analytics = await analyticsRes.json();
        const leads = await leadsRes.json();
        const appointments = await appointmentsRes.json();

        if (analytics.kpis) {
          setKpis([
            {
              label: 'Total Leads',
              value: String(analytics.kpis.totalLeads || 0),
              change: analytics.kpis.leadsChange || 12,
              icon: Users,
            },
            {
              label: 'Active Projects',
              value: String(analytics.kpis.activeProjects || 0),
              change: analytics.kpis.projectsChange || 8,
              icon: ClipboardList,
            },
            {
              label: 'Revenue (MTD)',
              value: `$${((analytics.kpis.revenue || 0) / 1000).toFixed(1)}k`,
              change: analytics.kpis.revenueChange || -3,
              icon: DollarSign,
            },
            {
              label: 'Conversion Rate',
              value: `${analytics.kpis.conversionRate || 0}%`,
              change: analytics.kpis.conversionChange || 5,
              icon: TrendingUp,
            },
          ]);
        }

        const leadsData = leads.data || leads || [];

        setRecentLeads(
          leadsData.map((l: Record<string, unknown>) => ({
            id: l.id as string,
            name: `${l.firstName} ${l.lastName}`,
            email: l.email as string,
            service: (l.serviceType || 'N/A') as string,
            status: l.status as string,
            date: new Date(l.createdAt as string).toLocaleDateString(),
          }))
        );

        // Build activity items from leads data
        const activityList: ActivityItem[] = leadsData.slice(0, 5).map((l: Record<string, unknown>) => {
          const status = (l.status || 'new') as string;
          const { icon, color } = getActivityIcon(status);
          return {
            id: l.id as string,
            type: 'lead' as const,
            description: `${l.firstName} ${l.lastName} ${getStatusAction(status)}`,
            timestamp: new Date(l.createdAt as string).toISOString(),
            icon,
            iconColor: color,
          };
        });

        setActivities(activityList);

        setUpcomingAppointments(
          (appointments.data || appointments || []).map((a: Record<string, unknown>) => ({
            id: a.id as string,
            date: new Date(a.date as string).toLocaleDateString(),
            client: `${a.firstName} ${a.lastName}`,
            service: (a.serviceType || 'N/A') as string,
            time: new Date(a.date as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }))
        );
      } catch (err) {
        console.error('Failed to fetch overview data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const statusClassMap: Record<string, string> = {
    new: 'status-new',
    contacted: 'status-contacted',
    qualified: 'status-qualified',
    proposal: 'status-proposal',
    won: 'status-won',
    lost: 'status-lost',
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Dashboard Overview</h2>
          <p className="text-sm text-muted-foreground">
            Your business at a glance
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-gold hover:bg-gold-light text-white">
            <UserPlus className="h-4 w-4 mr-1.5" />
            Add Lead
          </Button>
          <Button size="sm" variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
            <FileText className="h-4 w-4 mr-1.5" />
            New Quote
          </Button>
          <Button size="sm" variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
            <Phone className="h-4 w-4 mr-1.5" />
            Schedule Call
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          const isPositive = kpi.change >= 0;
          return (
            <Card key={index} className="dashboard-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {kpi.label}
                    </p>
                    <p className="text-2xl font-bold text-navy">{kpi.value}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-navy" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                  )}
                  <span
                    className={cn(
                      'text-xs font-medium',
                      isPositive ? 'text-green-600' : 'text-red-500'
                    )}
                  >
                    {isPositive ? '+' : ''}{kpi.change}%
                  </span>
                  <span className="text-xs text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-navy">Recent Leads</CardTitle>
                <CardDescription>Last 5 incoming leads</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-gold hover:text-gold-light">
                View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-72 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Service</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                        No leads yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentLeads.map((lead) => (
                      <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{lead.name}</p>
                            <p className="text-xs text-muted-foreground">{lead.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{lead.service}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn('text-xs capitalize', statusClassMap[lead.status] || '')}
                          >
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{lead.date}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-navy">Upcoming Appointments</CardTitle>
                <CardDescription>Next 3 scheduled visits</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-gold hover:text-gold-light">
                View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-72 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Client</TableHead>
                    <TableHead className="text-xs">Service</TableHead>
                    <TableHead className="text-xs">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                        No upcoming appointments
                      </TableCell>
                    </TableRow>
                  ) : (
                    upcomingAppointments.map((appt) => (
                      <TableRow key={appt.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="text-sm">{appt.date}</TableCell>
                        <TableCell className="text-sm font-medium">{appt.client}</TableCell>
                        <TableCell className="text-sm">{appt.service}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{appt.time}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Timeline */}
      <Card className="dashboard-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-navy">Recent Activity</CardTitle>
              <CardDescription>Latest lead activity and updates</CardDescription>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No recent activity
            </div>
          ) : (
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[18px] top-2 bottom-2 w-px bg-border" />

              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-4 relative">
                      {/* Timeline dot */}
                      <div
                        className={cn(
                          'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center z-10 border-2 border-white',
                          activity.iconColor
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pb-1">
                        <p className="text-sm text-foreground leading-relaxed">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>

                      {/* Connector to last item */}
                      {index < activities.length - 1 && (
                        <div className="absolute left-[18px] top-[36px] bottom-[-16px] w-px bg-border" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
