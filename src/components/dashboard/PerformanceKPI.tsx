'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Star, Clock, Repeat, TrendingUp, TrendingDown, Minus, Download, Target, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

const weeklyRevenueData = [
  { week: 'W1', revenue: 12400, target: 12000 },
  { week: 'W2', revenue: 15200, target: 13000 },
  { week: 'W3', revenue: 11800, target: 13500 },
  { week: 'W4', revenue: 18600, target: 14000 },
  { week: 'W5', revenue: 16900, target: 14500 },
  { week: 'W6', revenue: 21300, target: 15000 },
  { week: 'W7', revenue: 19800, target: 15500 },
  { week: 'W8', revenue: 22400, target: 16000 },
  { week: 'W9', revenue: 20100, target: 16500 },
  { week: 'W10', revenue: 24500, target: 17000 },
  { week: 'W11', revenue: 23200, target: 17500 },
  { week: 'W12', revenue: 26800, target: 18000 },
];

const monthlyProjects = [
  { month: 'Jan', completed: 12, target: 10 },
  { month: 'Feb', completed: 9, target: 10 },
  { month: 'Mar', completed: 14, target: 12 },
  { month: 'Apr', completed: 18, target: 15 },
  { month: 'May', completed: 22, target: 18 },
  { month: 'Jun', completed: 25, target: 20 },
];

const kpiCards = {
  weekly: [
    {
      title: 'Revenue',
      value: '$26,800',
      change: '+15.6%',
      trend: 'up' as const,
      icon: DollarSign,
      target: '$18,000',
      actual: 26800,
      targetVal: 18000,
    },
    {
      title: 'Customer Satisfaction',
      value: '4.9/5.0',
      change: '+0.1',
      trend: 'up' as const,
      icon: Star,
      target: '4.8/5.0',
      actual: 4.9,
      targetVal: 4.8,
    },
    {
      title: 'Avg Project Duration',
      value: '3.2 days',
      change: '-0.4 days',
      trend: 'up' as const,
      icon: Clock,
      target: '4.0 days',
      actual: 3.2,
      targetVal: 4.0,
      invertColor: true,
    },
    {
      title: 'Repeat Client Rate',
      value: '42%',
      change: '+3.2%',
      trend: 'up' as const,
      icon: Repeat,
      target: '40%',
      actual: 42,
      targetVal: 40,
    },
  ],
  monthly: [
    {
      title: 'Revenue',
      value: '$98,400',
      change: '+22.1%',
      trend: 'up' as const,
      icon: DollarSign,
      target: '$85,000',
      actual: 98400,
      targetVal: 85000,
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5.0',
      change: '+0.2',
      trend: 'up' as const,
      icon: Star,
      target: '4.7/5.0',
      actual: 4.8,
      targetVal: 4.7,
    },
    {
      title: 'Avg Project Duration',
      value: '3.5 days',
      change: '-0.6 days',
      trend: 'up' as const,
      icon: Clock,
      target: '4.0 days',
      actual: 3.5,
      targetVal: 4.0,
      invertColor: true,
    },
    {
      title: 'Repeat Client Rate',
      value: '40%',
      change: '+5.1%',
      trend: 'up' as const,
      icon: Repeat,
      target: '38%',
      actual: 40,
      targetVal: 38,
    },
  ],
};

const targetComparisons = [
  { metric: 'Monthly Revenue', actual: '$98,400', target: '$85,000', status: 'on-track' as const },
  { metric: 'New Leads', actual: '48', target: '50', status: 'warning' as const },
  { metric: 'Projects Completed', actual: '25', target: '20', status: 'on-track' as const },
  { metric: 'Customer Satisfaction', actual: '4.8', target: '4.7', status: 'on-track' as const },
  { metric: 'Response Time', actual: '2.1 hrs', target: '1 hr', status: 'behind' as const },
  { metric: 'Quote Conversion', actual: '32%', target: '35%', status: 'warning' as const },
];

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'on-track':
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    case 'behind':
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return <Minus className="w-4 h-4 text-gray-400" />;
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'on-track': return 'bg-green-50 text-green-700 border-green-200';
    case 'warning': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'behind': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'on-track': return 'On Track';
    case 'warning': return 'Caution';
    case 'behind': return 'Behind';
    default: return 'N/A';
  }
}

export function PerformanceKPI() {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const currentKPIs = kpiCards[period];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy">Performance KPI Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Track key performance indicators and business metrics</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period Toggle */}
          <div className="inline-flex bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                period === 'weekly'
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                period === 'monthly'
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentKPIs.map((kpi, index) => {
          const isPositive = kpi.trend === 'up';
          const effectivePositive = kpi.invertColor ? !isPositive : isPositive;
          const isAboveTarget = kpi.invertColor
            ? kpi.actual <= kpi.targetVal
            : kpi.actual >= kpi.targetVal;

          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="dashboard-card overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isAboveTarget ? 'bg-green-50' : 'bg-yellow-50'}`}>
                      <kpi.icon className={`w-5 h-5 ${isAboveTarget ? 'text-green-600' : 'text-yellow-600'}`} />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      effectivePositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {effectivePositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {kpi.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{kpi.title}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Target className="w-3 h-3" />
                      Target: {kpi.target}
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-2 py-0 ${
                        isAboveTarget ? 'border-green-200 text-green-700' : 'border-yellow-200 text-yellow-700'
                      }`}
                    >
                      {isAboveTarget ? '✓ Met' : '⚠ Near'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-navy flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gold" />
              Revenue Trend (12 Weeks)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    labelFormatter={(label) => `${label} Revenue`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0B1D3A"
                    strokeWidth={2.5}
                    dot={{ fill: '#0B1D3A', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Actual"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#C8973E"
                    strokeWidth={2}
                    strokeDasharray="6 3"
                    dot={false}
                    name="Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Project Completions */}
        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-navy flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sage" />
              Project Completions by Month
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyProjects} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Legend />
                  <Bar dataKey="completed" fill="#0B1D3A" radius={[4, 4, 0, 0]} name="Completed" />
                  <Bar dataKey="target" fill="#C8973E" radius={[4, 4, 0, 0]} opacity={0.5} name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Target vs Actual */}
      <Card className="dashboard-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-navy flex items-center gap-2">
            <Target className="w-4 h-4 text-gold" />
            Target vs Actual Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-muted-foreground pb-3 pr-4">Metric</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground pb-3 px-4">Actual</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground pb-3 px-4">Target</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground pb-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {targetComparisons.map((row) => (
                  <tr key={row.metric} className="border-b border-gray-50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 pr-4 text-sm font-medium text-navy">{row.metric}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-navy">{row.actual}</td>
                    <td className="py-3 px-4 text-sm text-right text-muted-foreground">{row.target}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant="outline" className={`text-[11px] ${statusColor(row.status)}`}>
                        <StatusIcon status={row.status} />
                        <span className="ml-1">{statusLabel(row.status)}</span>
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
