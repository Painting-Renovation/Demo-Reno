'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Eye,
  FileText,
  Phone,
  Calendar,
  TrendingUp,
  Globe,
  Smartphone,
  Referral,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCard {
  label: string;
  value: number;
  change: number;
  icon: React.ElementType;
  color: string;
}

interface LeadsOverTime {
  date: string;
  leads: number;
}

interface LeadSource {
  name: string;
  value: number;
  color: string;
}

interface ServicePopularity {
  name: string;
  count: number;
}

interface AnalyticsData {
  metrics: MetricCard[];
  leadsOverTime: LeadsOverTime[];
  leadSources: LeadSource[];
  servicePopularity: ServicePopularity[];
  miniFunnel: Array<{ stage: string; count: number }>;
}

const periodOptions = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

const SOURCE_COLORS = ['#0B1D3A', '#C8973E', '#5B7B5A', '#3B82A0'];

const defaultAnalytics: AnalyticsData = {
  metrics: [
    { label: 'Page Views', value: 2847, change: 12.5, icon: Eye, color: '#0B1D3A' },
    { label: 'Form Submissions', value: 48, change: 8.3, icon: FileText, color: '#C8973E' },
    { label: 'Phone Calls', value: 23, change: -5.2, icon: Phone, color: '#5B7B5A' },
    { label: 'Appointments Booked', value: 18, change: 15.7, icon: Calendar, color: '#3B82A0' },
  ],
  leadsOverTime: [
    { date: 'Jan', leads: 12 },
    { date: 'Feb', leads: 19 },
    { date: 'Mar', leads: 15 },
    { date: 'Apr', leads: 24 },
    { date: 'May', leads: 22 },
    { date: 'Jun', leads: 31 },
    { date: 'Jul', leads: 28 },
    { date: 'Aug', leads: 35 },
    { date: 'Sep', leads: 42 },
    { date: 'Oct', leads: 38 },
    { date: 'Nov', leads: 45 },
    { date: 'Dec', leads: 52 },
  ],
  leadSources: [
    { name: 'Website', value: 45, color: SOURCE_COLORS[0] },
    { name: 'Phone', value: 25, color: SOURCE_COLORS[1] },
    { name: 'Referral', value: 20, color: SOURCE_COLORS[2] },
    { name: 'Walk-in', value: 10, color: SOURCE_COLORS[3] },
  ],
  servicePopularity: [
    { name: 'Interior', count: 32 },
    { name: 'Exterior', count: 24 },
    { name: 'Cabinet', count: 18 },
    { name: 'Commercial', count: 12 },
    { name: 'Deck', count: 9 },
    { name: 'Wallpaper', count: 5 },
  ],
  miniFunnel: [
    { stage: 'Awareness', count: 120 },
    { stage: 'Interest', count: 85 },
    { stage: 'Consideration', count: 52 },
    { stage: 'Intent', count: 34 },
    { stage: 'Evaluation', count: 22 },
    { stage: 'Purchase', count: 14 },
  ],
};

export default function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics?period=${period}`);
        const analytics = await res.json();

        if (analytics.metrics || analytics.leadsOverTime) {
          setData({
            metrics: analytics.metrics || defaultAnalytics.metrics,
            leadsOverTime: analytics.leadsOverTime || defaultAnalytics.leadsOverTime,
            leadSources: analytics.leadSources || defaultAnalytics.leadSources,
            servicePopularity: analytics.servicePopularity || defaultAnalytics.servicePopularity,
            miniFunnel: analytics.miniFunnel || defaultAnalytics.miniFunnel,
          });
        } else {
          setData(defaultAnalytics);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setData(defaultAnalytics);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-navy">Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Performance metrics and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          {periodOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={period === opt.value ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'h-8 text-xs',
                period === opt.value
                  ? 'bg-navy hover:bg-navy-light text-white'
                  : 'border-navy text-navy hover:bg-navy hover:text-white'
              )}
              onClick={() => setPeriod(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change >= 0;
          return (
            <Card key={index} className="dashboard-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold text-navy">
                      {metric.value.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${metric.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: metric.color }} />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp
                    className={cn(
                      'h-3 w-3',
                      isPositive ? 'text-green-600' : 'text-red-500 rotate-180'
                    )}
                  />
                  <span
                    className={cn(
                      'text-xs font-medium',
                      isPositive ? 'text-green-600' : 'text-red-500'
                    )}
                  >
                    {isPositive ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-xs text-muted-foreground">vs previous</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time */}
        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Leads Over Time</CardTitle>
            <CardDescription>New leads by period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.leadsOverTime} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B1D3A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0B1D3A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#6B7280" />
                <YAxis tick={{ fontSize: 11 }} stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: '1px solid #E5E1D8',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#0B1D3A"
                  strokeWidth={2}
                  fill="url(#leadsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Sources Pie Chart */}
        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Lead Sources</CardTitle>
            <CardDescription>Where your leads come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ResponsiveContainer width="60%" height={280}>
                <PieChart>
                  <Pie
                    data={data.leadSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data.leadSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, 'Share']}
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: '1px solid #E5E1D8',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {data.leadSources.map((source, index) => (
                  <div key={source.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-sm text-muted-foreground flex-1">{source.name}</span>
                    <span className="text-sm font-medium">{source.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Popularity */}
        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Service Popularity</CardTitle>
            <CardDescription>Most requested services</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.servicePopularity} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#6B7280" />
                <YAxis tick={{ fontSize: 11 }} stroke="#6B7280" />
                <Tooltip
                  formatter={(value: number) => [`${value} leads`, 'Count']}
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: '1px solid #E5E1D8',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={36}>
                  {data.servicePopularity.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#0B1D3A' : index === 1 ? '#C8973E' : '#132D5E'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mini Funnel Chart */}
        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Conversion Funnel</CardTitle>
            <CardDescription>Lead progression through stages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.miniFunnel} layout="vertical" margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="#6B7280" />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} stroke="#6B7280" width={90} />
                <Tooltip
                  formatter={(value: number) => [`${value} leads`, 'Count']}
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: '1px solid #E5E1D8',
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={22}>
                  {data.miniFunnel.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={STAGE_COLORS[index] || '#0B1D3A'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const STAGE_COLORS = ['#0B1D3A', '#132D5E', '#1E4D8C', '#C8973E', '#E8B94E', '#5B7B5A'];
