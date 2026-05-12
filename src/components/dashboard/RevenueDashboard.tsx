'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ExportButton from './ExportButton';

// Mock data for monthly revenue
const monthlyRevenue = [
  { month: 'Jan', revenue: 18500, expenses: 12400 },
  { month: 'Feb', revenue: 22300, expenses: 14200 },
  { month: 'Mar', revenue: 28700, expenses: 16800 },
  { month: 'Apr', revenue: 34100, expenses: 19200 },
  { month: 'May', revenue: 38600, expenses: 21500 },
  { month: 'Jun', revenue: 42300, expenses: 23800 },
  { month: 'Jul', revenue: 39800, expenses: 22400 },
  { month: 'Aug', revenue: 35200, expenses: 20100 },
  { month: 'Sep', revenue: 31400, expenses: 18600 },
  { month: 'Oct', revenue: 27800, expenses: 16900 },
  { month: 'Nov', revenue: 24100, expenses: 15200 },
  { month: 'Dec', revenue: 32500, expenses: 19800 },
];

// Revenue by service type
const revenueByService = [
  { name: 'Interior', value: 124800, color: '#0B1D3A' },
  { name: 'Exterior', value: 93600, color: '#C8973E' },
  { name: 'Cabinet', value: 46800, color: '#5B7B5A' },
  { name: 'Commercial', value: 31200, color: '#E8B94E' },
  { name: 'Other', value: 15600, color: '#94A3B8' },
];

// Top projects
const topProjects = [
  { id: '1', name: 'Johnson Residence', client: 'Robert Johnson', service: 'Interior', revenue: 8200, status: 'completed', date: '2024-10-15' },
  { id: '2', name: 'Maple Street Office', client: 'TechVentures Inc.', service: 'Commercial', revenue: 14500, status: 'in-progress', date: '2024-11-01' },
  { id: '3', name: 'Chen Family Home', client: 'David Chen', service: 'Exterior', revenue: 6800, status: 'completed', date: '2024-09-20' },
  { id: '4', name: 'Riverside Condo', client: 'Sarah Williams', service: 'Interior', revenue: 5500, status: 'completed', date: '2024-11-10' },
  { id: '5', name: 'Oakville Kitchen', client: 'Maria Garcia', service: 'Cabinet', revenue: 4200, status: 'in-progress', date: '2024-11-18' },
  { id: '6', name: 'Downtown Retail', client: 'ShopLocal Co.', service: 'Commercial', revenue: 12300, status: 'quoted', date: '2024-11-22' },
  { id: '7', name: 'Thompson Exterior', client: 'James Thompson', service: 'Exterior', revenue: 7100, status: 'completed', date: '2024-10-28' },
  { id: '8', name: 'Parkview Suite', client: 'Emily Brown', service: 'Interior', revenue: 4800, status: 'quoted', date: '2024-11-25' },
];

// Monthly targets
const monthlyTargets = [
  { label: 'Revenue', current: 32500, target: 40000, color: 'bg-gold' },
  { label: 'New Leads', current: 18, target: 25, color: 'bg-navy' },
  { label: 'Projects Won', current: 5, target: 8, color: 'bg-sage' },
  { label: 'Avg. Rating', current: 4.7, target: 5.0, color: 'bg-amber-500' },
];

interface KPI {
  label: string;
  value: string;
  change: number;
  prefix?: string;
  icon: React.ElementType;
  subtitle: string;
}

export default function RevenueDashboard() {
  const [activeView, setActiveView] = useState<'overview' | 'projects'>('overview');

  const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1].revenue;
  const lastMonthRevenue = monthlyRevenue[monthlyRevenue.length - 2].revenue;
  const revenueChange = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1);
  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const avgProjectValue = Math.round(totalRevenue / 48);
  const pipelineValue = topProjects.filter(p => p.status === 'quoted').reduce((sum, p) => sum + p.revenue, 0);
  const revenuePerLead = Math.round(totalRevenue / 156);

  const kpis: KPI[] = [
    {
      label: 'Monthly Revenue',
      value: `$${(currentMonthRevenue / 1000).toFixed(1)}k`,
      change: parseFloat(revenueChange),
      icon: DollarSign,
      subtitle: `vs $${(lastMonthRevenue / 1000).toFixed(1)}k last month`,
    },
    {
      label: 'Avg Project Value',
      value: `$${avgProjectValue.toLocaleString()}`,
      change: 8.2,
      icon: Target,
      subtitle: 'Across all completed projects',
    },
    {
      label: 'Pipeline Value',
      value: `$${pipelineValue.toLocaleString()}`,
      change: 12.5,
      icon: TrendingUp,
      subtitle: 'Quoted but not yet won',
    },
    {
      label: 'Revenue Per Lead',
      value: `$${revenuePerLead.toLocaleString()}`,
      change: -2.1,
      icon: BarChart3,
      subtitle: '12-month average',
    },
  ];

  const statusClassMap: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    quoted: 'bg-amber-100 text-amber-800',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Revenue Dashboard</h2>
          <p className="text-sm text-muted-foreground">Financial health and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('overview')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              activeView === 'overview'
                ? 'bg-navy text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView('projects')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              activeView === 'projects'
                ? 'bg-navy text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            Top Projects
          </button>
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/5">
                    <Icon className="h-5 w-5 text-navy" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                  )}
                  <span
                    className={cn(
                      'text-xs font-medium',
                      isPositive ? 'text-emerald-600' : 'text-red-500'
                    )}
                  >
                    {isPositive ? '+' : ''}{kpi.change}%
                  </span>
                  <span className="text-xs text-muted-foreground">{kpi.subtitle}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {activeView === 'overview' ? (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <Card className="dashboard-card lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-navy">Monthly Revenue</CardTitle>
                    <CardDescription>Last 12 months performance</CardDescription>
                  </div>
                  <ExportButton
                    data={monthlyRevenue.map(m => ({ Month: m.month, Revenue: `$${m.revenue.toLocaleString()}`, Expenses: `$${m.expenses.toLocaleString()}`, Profit: `$${(m.revenue - m.expenses).toLocaleString()}` }))}
                    filename="monthly-revenue"
                    columns={[
                      { key: 'Month', label: 'Month' },
                      { key: 'Revenue', label: 'Revenue' },
                      { key: 'Expenses', label: 'Expenses' },
                      { key: 'Profit', label: 'Profit' },
                    ]}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenue}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C8973E" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#C8973E" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0B1D3A" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#0B1D3A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="#94a3b8"
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#C8973E"
                        strokeWidth={2.5}
                        fill="url(#revenueGradient)"
                        name="Revenue"
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#0B1D3A"
                        strokeWidth={1.5}
                        fill="url(#expenseGradient)"
                        name="Expenses"
                        strokeDasharray="5 5"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Service */}
            <Card className="dashboard-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-navy">Revenue by Service</CardTitle>
                <CardDescription>12-month breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueByService}
                        cx="50%"
                        cy="45%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {revenueByService.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                          <span className="text-xs text-foreground">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Targets */}
          <Card className="dashboard-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-navy">Monthly Targets</CardTitle>
              <CardDescription>December 2024 progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {monthlyTargets.map((target) => {
                  const pct = Math.min(100, (target.current / target.target) * 100);
                  const isSpecial = target.label === 'Avg. Rating';
                  return (
                    <div key={target.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-navy">{target.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {isSpecial ? `${target.current}/${target.target}` : `${Math.round(pct)}%`}
                        </span>
                      </div>
                      <Progress value={pct} className={cn('h-2', target.color)} />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {isSpecial ? `${target.current} stars` : `$${target.current.toLocaleString()}`}
                        </span>
                        <span className="text-muted-foreground">
                          {isSpecial ? `${target.target} stars` : `$${target.target.toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Top Projects Table */
        <Card className="dashboard-card overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-navy">Top Projects</CardTitle>
                <CardDescription>Highest revenue projects by status</CardDescription>
              </div>
              <ExportButton
                data={topProjects.map(p => ({
                  Project: p.name,
                  Client: p.client,
                  Service: p.service,
                  Revenue: `$${p.revenue.toLocaleString()}`,
                  Status: p.status,
                  Date: p.date,
                }))}
                filename="top-projects"
                columns={[
                  { key: 'Project', label: 'Project' },
                  { key: 'Client', label: 'Client' },
                  { key: 'Service', label: 'Service' },
                  { key: 'Revenue', label: 'Revenue' },
                  { key: 'Status', label: 'Status' },
                  { key: 'Date', label: 'Date' },
                ]}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Project</TableHead>
                    <TableHead className="text-xs">Client</TableHead>
                    <TableHead className="text-xs">Service</TableHead>
                    <TableHead className="text-xs">Revenue</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProjects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium">{project.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{project.client}</TableCell>
                      <TableCell className="text-sm">{project.service}</TableCell>
                      <TableCell className="text-sm font-semibold text-navy">
                        ${project.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn('text-xs capitalize', statusClassMap[project.status] || '')}
                        >
                          {project.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{project.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
