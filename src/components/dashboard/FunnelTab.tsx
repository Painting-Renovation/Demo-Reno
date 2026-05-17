'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FunnelStage {
  name: string;
  count: number;
  rate: number;
  color: string;
}

interface FunnelData {
  stages: FunnelStage[];
  totalLeads: number;
  overallConversion: number;
}

const STAGE_COLORS = ['#0B1D3A', '#132D5E', '#1E4D8C', '#C8973E', '#E8B94E', '#5B7B5A'];

const STAGE_NAMES = [
  'Awareness',
  'Interest',
  'Consideration',
  'Intent',
  'Evaluation',
  'Purchase',
];

const STAGE_KEYS = [
  'awareness',
  'interest',
  'consideration',
  'intent',
  'evaluation',
  'purchase',
];

export default function FunnelTab() {
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [stageLeads, setStageLeads] = useState<Array<{ id: string; name: string; status: string }>>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch('/api/analytics?view=funnel');
        const data = await res.json();

        if (data.funnel) {
          const stages = STAGE_NAMES.map((name, i) => {
            const key = STAGE_KEYS[i];
            const count = data.funnel[key] || 0;
            const prevCount = i > 0 ? (data.funnel[STAGE_KEYS[i - 1]] || 0) : count;
            const rate = prevCount > 0 ? ((count / prevCount) * 100).toFixed(1) : '0';
            return {
              name,
              count,
              rate: parseFloat(rate as string),
              color: STAGE_COLORS[i],
            };
          });

          const totalLeads = stages.reduce((sum, s) => sum + s.count, 0);
          const firstStage = stages[0]?.count || 1;
          const lastStage = stages[stages.length - 1]?.count || 0;
          const overallConversion = ((lastStage / firstStage) * 100).toFixed(1);

          setFunnelData({
            stages,
            totalLeads,
            overallConversion: parseFloat(overallConversion),
          });
        }
      } catch (err) {
        console.error('Failed to fetch funnel data:', err);
        // Use demo data
        setFunnelData({
          stages: [
            { name: 'Awareness', count: 120, rate: 100, color: STAGE_COLORS[0] },
            { name: 'Interest', count: 85, rate: 70.8, color: STAGE_COLORS[1] },
            { name: 'Consideration', count: 52, rate: 61.2, color: STAGE_COLORS[2] },
            { name: 'Intent', count: 34, rate: 65.4, color: STAGE_COLORS[3] },
            { name: 'Evaluation', count: 22, rate: 64.7, color: STAGE_COLORS[4] },
            { name: 'Purchase', count: 14, rate: 63.6, color: STAGE_COLORS[5] },
          ],
          totalLeads: 327,
          overallConversion: 11.7,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleStageClick = async (stageName: string) => {
    const stageKey = STAGE_KEYS[STAGE_NAMES.indexOf(stageName)];
    if (selectedStage === stageName) {
      setSelectedStage(null);
      setStageLeads([]);
      return;
    }
    setSelectedStage(stageName);
    try {
      const res = await fetch(`/api/leads?funnelStage=${stageKey}&limit=20`);
      const data = await res.json();
      setStageLeads(
        (data.data || data || []).map((l: Record<string, unknown>) => ({
          id: l.id as string,
          name: `${l.firstName} ${l.lastName}`,
          status: l.status as string,
        }))
      );
    } catch (err) {
      console.error(err);
      setStageLeads([]);
    }
  };

  const maxCount = funnelData ? Math.max(...funnelData.stages.map((s) => s.count)) : 1;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!funnelData) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No funnel data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-navy">Sales Funnel</h2>
          <p className="text-sm text-muted-foreground">
            Track leads through your conversion pipeline
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Overall Conversion</p>
            <p className="text-lg font-bold text-navy">{funnelData.overallConversion}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Leads</p>
            <p className="text-lg font-bold text-navy">{funnelData.totalLeads}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Funnel */}
        <div className="lg:col-span-2">
          <Card className="dashboard-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {funnelData.stages.map((stage, index) => {
                const widthPercent = Math.max((stage.count / maxCount) * 100, 15);
                const dropOff = index > 0 ? funnelData.stages[index - 1].count - stage.count : 0;
                return (
                  <div key={stage.name}>
                    {/* Drop-off indicator */}
                    {dropOff > 0 && (
                      <div className="flex justify-center mb-1">
                        <div className="flex items-center gap-1 text-xs text-red-500">
                          <TrendingDown className="h-3 w-3" />
                          <span>-{dropOff} leads lost</span>
                          <span className="text-muted-foreground">
                            ({((dropOff / funnelData.stages[index - 1].count) * 100).toFixed(1)}% drop-off)
                          </span>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => handleStageClick(stage.name)}
                      className={cn(
                        'w-full rounded-lg transition-all duration-300 text-left group',
                        selectedStage === stage.name && 'ring-2 ring-gold'
                      )}
                    >
                      <div
                        className="mx-auto rounded-lg py-3 px-4 flex items-center justify-between text-white transition-all duration-300 hover:opacity-90"
                        style={{
                          width: `${widthPercent}%`,
                          backgroundColor: stage.color,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{stage.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold">{stage.count}</span>
                          <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </button>

                    {/* Conversion rate between stages */}
                    {index < funnelData.stages.length - 1 && (
                      <div className="flex justify-center my-1">
                        <span className="text-xs text-muted-foreground">
                          {stage.rate}% conversion
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Stage Leads List */}
          <Card className="dashboard-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {selectedStage ? `Leads in ${selectedStage}` : 'Select a Stage'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStage ? (
                stageLeads.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No leads in this stage</p>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-muted/50"
                      >
                        <span className="text-sm font-medium">{lead.name}</span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-xs capitalize status-${lead.status}'
                          )}
                        >
                          {lead.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Click a funnel stage to view leads
                </p>
              )}
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="dashboard-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Lead Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={funnelData.stages} layout="vertical" margin={{ left: 0, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={85} />
                  <Tooltip
                    formatter={(value: number) => [`${value} leads`, 'Count']}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={18}>
                    {funnelData.stages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
