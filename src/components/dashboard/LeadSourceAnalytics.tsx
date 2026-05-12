'use client';

import { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Trophy, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Lead source data
interface LeadSourceData {
  name: string;
  leads: number;
  converted: number;
  revenue: number;
  color: string;
  icon: string;
}

const leadSources: LeadSourceData[] = [
  { name: 'Google Ads', leads: 128, converted: 38, revenue: 86400, color: '#0B1D3A', icon: '🔍' },
  { name: 'Referral', leads: 86, converted: 42, revenue: 72800, color: '#C8973E', icon: '🤝' },
  { name: 'Social Media', leads: 64, converted: 18, revenue: 32400, color: '#5B7B5A', icon: '📱' },
  { name: 'Walk-in', leads: 32, converted: 14, revenue: 19600, color: '#3B82A0', icon: '🚶' },
  { name: 'Website SEO', leads: 96, converted: 29, revenue: 52200, color: '#8B5E3C', icon: '🌐' },
  { name: 'Other', leads: 24, converted: 6, revenue: 8400, color: '#6B7280', icon: '📋' },
];

// Conversion rate by source
const conversionData = leadSources.map((source) => ({
  name: source.name,
  rate: Math.round((source.converted / source.leads) * 100 * 10) / 10,
  leads: source.leads,
  color: source.color,
}));

const totalLeads = leadSources.reduce((sum, s) => sum + s.leads, 0);
const totalConverted = leadSources.reduce((sum, s) => sum + s.converted, 0);
const totalRevenue = leadSources.reduce((sum, s) => sum + s.revenue, 0);
const overallConversion = Math.round((totalConverted / totalLeads) * 100 * 10) / 10;

// Find top performing source
const topSource = [...leadSources].sort((a, b) => {
  const rateA = a.converted / a.leads;
  const rateB = b.converted / b.leads;
  return rateB - rateA;
})[0];

// Previous period data for comparison
const previousPeriod = {
  totalLeads: 380,
  converted: 112,
  revenue: 238000,
};

type ViewMode = 'sources' | 'conversion';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg text-sm">
        <p className="font-semibold text-navy mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-500">{entry.name}:</span>
            <span className="font-medium text-navy">
              {entry.name === 'Rate' ? `${entry.value}%` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function LeadSourceAnalytics() {
  const [viewMode, setViewMode] = useState<ViewMode>('sources');

  // Period-over-period changes
  const leadsChange = Math.round(((totalLeads - previousPeriod.totalLeads) / previousPeriod.totalLeads) * 100);
  const convertedChange = Math.round(((totalConverted - previousPeriod.converted) / previousPeriod.converted) * 100);
  const revenueChange = Math.round(((totalRevenue - previousPeriod.revenue) / previousPeriod.revenue) * 100);

  const pieData = leadSources.map((source) => ({
    name: source.name,
    value: source.leads,
    color: source.color,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-navy">Lead Source Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Detailed breakdown of lead sources and conversion rates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'sources' ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'h-8 text-xs',
              viewMode === 'sources'
                ? 'bg-navy hover:bg-navy-light text-white'
                : 'border-navy text-navy hover:bg-navy hover:text-white'
            )}
            onClick={() => setViewMode('sources')}
          >
            Source Distribution
          </Button>
          <Button
            variant={viewMode === 'conversion' ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'h-8 text-xs',
              viewMode === 'conversion'
                ? 'bg-navy hover:bg-navy-light text-white'
                : 'border-navy text-navy hover:bg-navy hover:text-white'
            )}
            onClick={() => setViewMode('conversion')}
          >
            Conversion Rates
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Leads
                </p>
                <p className="text-2xl font-bold text-navy">{totalLeads}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/10">
                <Target className="h-5 w-5 text-navy" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {leadsChange >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
              <span className={cn('text-xs font-medium', leadsChange >= 0 ? 'text-green-600' : 'text-red-500')}>
                {leadsChange > 0 ? '+' : ''}{leadsChange}%
              </span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Converted
                </p>
                <p className="text-2xl font-bold text-navy">{totalConverted}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                <TrendingUp className="h-5 w-5 text-gold" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {convertedChange >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
              <span className={cn('text-xs font-medium', convertedChange >= 0 ? 'text-green-600' : 'text-red-500')}>
                {convertedChange > 0 ? '+' : ''}{convertedChange}%
              </span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Conversion Rate
                </p>
                <p className="text-2xl font-bold text-navy">{overallConversion}%</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage/10">
                <TrendingUp className="h-5 w-5 text-sage" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-xs text-muted-foreground">
                {totalConverted} of {totalLeads} leads
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-gold/30">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gold">
                  ${(totalRevenue / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                <Trophy className="h-5 w-5 text-gold" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {revenueChange >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
              <span className={cn('text-xs font-medium', revenueChange >= 0 ? 'text-green-600' : 'text-red-500')}>
                {revenueChange > 0 ? '+' : ''}{revenueChange}%
              </span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Lead Sources */}
        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Lead Source Distribution</CardTitle>
                <CardDescription>Leads by acquisition channel</CardDescription>
              </div>
              <Badge variant="outline" className="border-gold/30 text-gold text-xs">
                {totalLeads} total leads
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 shrink-0">
                {leadSources.map((source) => {
                  const pct = Math.round((source.leads / totalLeads) * 100);
                  return (
                    <div key={source.name} className="flex items-center gap-2.5 min-w-[160px]">
                      <span className="text-sm">{source.icon}</span>
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: source.color }} />
                      <span className="text-sm text-muted-foreground flex-1">{source.name}</span>
                      <span className="text-sm font-medium text-navy">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart - Conversion Rate */}
        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Conversion Rate by Source</CardTitle>
                <CardDescription>How each source performs</CardDescription>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-sage bg-sage/10 px-2.5 py-1 rounded-full">
                <Trophy className="w-3 h-3" />
                <span className="font-medium">Top: {topSource.name}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={conversionData} margin={{ left: -10, right: 10 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  stroke="#6B7280"
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 11 }} stroke="#6B7280" unit="%" />
                <Tooltip
                  content={({ active, payload, label }) => (
                    <CustomTooltip
                      active={active}
                      payload={payload?.map((p) => ({
                        name: 'Rate',
                        value: p.value as number,
                        color: p.color as string,
                      }))}
                      label={label}
                    />
                  )}
                />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]} barSize={36}>
                  {conversionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === topSource.name ? '#C8973E' : entry.color}
                      opacity={entry.name === topSource.name ? 1 : 0.7}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Source Detail Table */}
      <Card className="dashboard-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Source Performance Details</CardTitle>
          <CardDescription>Detailed metrics for each lead source</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Source</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Leads</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Converted</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rate</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Revenue</th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {leadSources.map((source) => {
                  const rate = Math.round((source.converted / source.leads) * 100 * 10) / 10;
                  const isTop = source.name === topSource.name;
                  return (
                    <tr
                      key={source.name}
                      className={cn(
                        'border-b border-gray-50 transition-colors hover:bg-gold/5',
                        isTop && 'bg-gold/5'
                      )}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: source.color }} />
                          <span className="font-medium text-navy">{source.name}</span>
                          {isTop && (
                            <Badge className="bg-gold/15 text-gold border-0 text-[9px] px-1.5 py-0">
                              <Trophy className="w-2.5 h-2.5 mr-0.5" />
                              TOP
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-navy">{source.leads}</td>
                      <td className="py-3 px-3 text-right text-muted-foreground">{source.converted}</td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={cn(
                            'font-medium',
                            rate >= 40 ? 'text-green-600' : rate >= 25 ? 'text-gold' : 'text-muted-foreground'
                          )}
                        >
                          {rate}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-navy">
                        ${source.revenue.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full mx-auto overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${rate}%`,
                              backgroundColor: rate >= 40 ? '#5B7B5A' : rate >= 25 ? '#C8973E' : '#6B7280',
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
