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

export default function OverviewTab() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [recentLeads, setRecentLeads] = useState<LeadRow[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
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

        setRecentLeads(
          (leads.data || leads || []).map((l: Record<string, unknown>) => ({
            id: l.id as string,
            name: `${l.firstName} ${l.lastName}`,
            email: l.email as string,
            service: (l.serviceType || 'N/A') as string,
            status: l.status as string,
            date: new Date(l.createdAt as string).toLocaleDateString(),
          }))
        );

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
    </div>
  );
}
