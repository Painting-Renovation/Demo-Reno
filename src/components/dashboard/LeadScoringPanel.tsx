'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowUpDown,
  Target,
  Zap,
  Clock,
  DollarSign,
  MessageSquare,
  Flame,
  Thermometer,
  Snowflake,
  Sparkles,
  Info,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ── Types ──────────────────────────────────────────
interface LeadScore {
  leadId: string;
  firstName: string;
  lastName: string;
  email: string;
  serviceType: string | null;
  status: string;
  leadSource: string;
  overallScore: number;
  breakdown: ScoreBreakdown;
}

interface ScoreBreakdown {
  engagement: { score: number; maxScore: number; details: string };
  sourceQuality: { score: number; maxScore: number; details: string };
  timelineUrgency: { score: number; maxScore: number; details: string };
  projectValue: { score: number; maxScore: number; details: string };
  responseRate: { score: number; maxScore: number; details: string };
}

type SortField = 'score-desc' | 'score-asc' | 'name' | 'date';

// ── Scoring helpers ────────────────────────────────
function computeScore(lead: Record<string, unknown>): ScoreBreakdown {
  // Engagement: based on activities count and status progress
  const activityCount = (lead.activities as number) || 0;
  const statusOrder = ['new', 'contacted', 'qualified', 'proposal', 'won'];
  const statusIdx = statusOrder.indexOf((lead.status as string) || 'new');
  const engagementScore = Math.min(30, Math.round((statusIdx * 4) + (activityCount * 3)));

  // Source quality
  const sourceQualityMap: Record<string, number> = {
    referral: 20,
    organic: 16,
    website: 14,
    google: 15,
    social: 10,
    phone: 12,
    'walk-in': 18,
  };
  const sourceQuality = sourceQualityMap[(lead.leadSource as string) || 'website'] || 10;

  // Timeline urgency: based on priority and how recent
  const priorityMap: Record<string, number> = { urgent: 30, high: 22, medium: 14, low: 6 };
  const timelineUrgency = priorityMap[(lead.priority as string) || 'medium'] || 14;

  // Project value estimate
  const estValue = (lead.estimatedValue as number) || 0;
  const projectValue = estValue > 5000 ? 30 : estValue > 2000 ? 22 : estValue > 500 ? 14 : 6;

  // Response rate: based on funnel stage progress
  const funnelOrder = ['awareness', 'interest', 'consideration', 'intent', 'evaluation', 'purchase'];
  const funnelIdx = funnelOrder.indexOf((lead.funnelStage as string) || 'awareness');
  const responseRate = Math.min(20, Math.round(2 + (funnelIdx * 3.5)));

  return {
    engagement: {
      score: engagementScore,
      maxScore: 30,
      details: `${activityCount} interaction${activityCount !== 1 ? 's' : ''} recorded, status: ${lead.status || 'new'}`,
    },
    sourceQuality: {
      score: sourceQuality,
      maxScore: 20,
      details: `Lead source: ${lead.leadSource || 'website'}`,
    },
    timelineUrgency: {
      score: timelineUrgency,
      maxScore: 30,
      details: `Priority: ${lead.priority || 'medium'}`,
    },
    projectValue: {
      score: projectValue,
      maxScore: 30,
      details: `Est. value: $${estValue.toLocaleString()}`,
    },
    responseRate: {
      score: responseRate,
      maxScore: 20,
      details: `Funnel stage: ${lead.funnelStage || 'awareness'}`,
    },
  };
}

function getOverallScore(breakdown: ScoreBreakdown): number {
  const total = Object.values(breakdown).reduce((sum, b) => sum + b.score, 0);
  return Math.min(100, Math.round(total / 130 * 100));
}

function getScoreTier(score: number): { label: string; icon: React.ElementType; colorClass: string; bgClass: string } {
  if (score >= 80) return { label: 'Hot', icon: Flame, colorClass: 'text-red-600', bgClass: 'bg-red-50 border-red-200' };
  if (score >= 50) return { label: 'Warm', icon: Thermometer, colorClass: 'text-amber-600', bgClass: 'bg-amber-50 border-amber-200' };
  return { label: 'Cold', icon: Snowflake, colorClass: 'text-blue-600', bgClass: 'bg-blue-50 border-blue-200' };
}

// ── Component ──────────────────────────────────────
interface LeadScoringPanelProps {
  leads: Array<Record<string, unknown>>;
  onScored?: () => void;
}

export default function LeadScoringPanel({ leads, onScored }: LeadScoringPanelProps) {
  const [sortField, setSortField] = useState<SortField>('score-desc');
  const [selectedLead, setSelectedLead] = useState<LeadScore | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);
  const [autoScoring, setAutoScoring] = useState(false);

  const scoredLeads = useMemo<LeadScore[]>(() => {
    return leads
      .filter((l) => l.status !== 'lost' && l.status !== 'archived')
      .map((lead) => {
        const breakdown = computeScore(lead);
        return {
          leadId: lead.id as string,
          firstName: lead.firstName as string,
          lastName: lead.lastName as string,
          email: lead.email as string,
          serviceType: lead.serviceType as string | null,
          status: lead.status as string,
          leadSource: lead.leadSource as string,
          overallScore: getOverallScore(breakdown),
          breakdown,
        };
      });
  }, [leads]);

  const sortedLeads = useMemo(() => {
    return [...scoredLeads].sort((a, b) => {
      switch (sortField) {
        case 'score-desc': return b.overallScore - a.overallScore;
        case 'score-asc': return a.overallScore - b.overallScore;
        case 'name': return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        default: return 0;
      }
    });
  }, [scoredLeads, sortField]);

  const hotCount = scoredLeads.filter((l) => l.overallScore >= 80).length;
  const warmCount = scoredLeads.filter((l) => l.overallScore >= 50 && l.overallScore < 80).length;
  const coldCount = scoredLeads.filter((l) => l.overallScore < 50).length;

  const handleAutoScore = async () => {
    setAutoScoring(true);
    try {
      await fetch('/api/leads?score=true');
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch {
      // Use local computation
    } finally {
      setAutoScoring(false);
      onScored?.();
    }
  };

  const openDetail = (lead: LeadScore) => {
    setSelectedLead(lead);
    setDetailOpen(true);
  };

  return (
    <>
      <Card className="dashboard-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-base font-semibold text-navy flex items-center gap-2">
                <Target className="h-4 w-4" />
                Lead Scoring
              </CardTitle>
              <CardDescription className="mt-1">
                {scoredLeads.length} active leads scored ·{' '}
                <span className="text-red-500 font-medium">{hotCount} hot</span> ·{' '}
                <span className="text-amber-500 font-medium">{warmCount} warm</span> ·{' '}
                <span className="text-blue-500 font-medium">{coldCount} cold</span>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCriteria(!showCriteria)}
                className="text-xs"
              >
                <Info className="h-3.5 w-3.5 mr-1" />
                Criteria
              </Button>
              <Button
                size="sm"
                onClick={handleAutoScore}
                disabled={autoScoring}
                className="bg-navy hover:bg-navy-light text-white text-xs"
              >
                <Sparkles className={cn('h-3.5 w-3.5 mr-1', autoScoring && 'animate-spin')} />
                {autoScoring ? 'Scoring...' : 'Auto-Score All'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Criteria Explanation */}
          <AnimatePresence>
            {showCriteria && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-4"
              >
                <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-3">
                  <p className="text-sm font-medium text-navy">Scoring Criteria (0–100)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start gap-2">
                      <Zap className="h-3.5 w-3.5 text-gold mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Engagement (up to 30 pts)</p>
                        <p className="text-muted-foreground">Number of interactions and lead status progression</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target className="h-3.5 w-3.5 text-gold mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Source Quality (up to 20 pts)</p>
                        <p className="text-muted-foreground">Referral sources score higher than organic</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-3.5 w-3.5 text-gold mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Timeline Urgency (up to 30 pts)</p>
                        <p className="text-muted-foreground">Higher priority leads indicate faster closing</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-3.5 w-3.5 text-gold mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Project Value (up to 30 pts)</p>
                        <p className="text-muted-foreground">Higher estimated value = more revenue potential</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-gold mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Response Rate (up to 20 pts)</p>
                        <p className="text-muted-foreground">Funnel stage progress indicates engagement level</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <div className="flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-red-500" />
                      <span className="text-xs font-medium">Hot: 80+</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Thermometer className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs font-medium">Warm: 50-79</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Snowflake className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-xs font-medium">Cold: 0-49</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-muted-foreground">Sort by:</span>
            <Button
              size="sm"
              variant={sortField === 'score-desc' ? 'default' : 'outline'}
              onClick={() => setSortField('score-desc')}
              className="h-7 text-xs bg-navy hover:bg-navy-light text-white"
            >
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Highest Score
            </Button>
            <Button
              size="sm"
              variant={sortField === 'score-asc' ? 'default' : 'outline'}
              onClick={() => setSortField('score-asc')}
              className="h-7 text-xs"
            >
              <ArrowUpDown className="h-3 w-3 mr-1 rotate-180" />
              Lowest Score
            </Button>
            <Button
              size="sm"
              variant={sortField === 'name' ? 'default' : 'outline'}
              onClick={() => setSortField('name')}
              className="h-7 text-xs"
            >
              Name
            </Button>
          </div>

          {/* Lead Score List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {sortedLeads.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No active leads to score
              </div>
            ) : (
              sortedLeads.map((lead, i) => {
                const tier = getScoreTier(lead.overallScore);
                const TierIcon = tier.icon;
                return (
                  <motion.div
                    key={lead.leadId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => openDetail(lead)}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm',
                      tier.bgClass
                    )}
                  >
                    {/* Score Badge */}
                    <div className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold text-sm border',
                      tier.colorClass,
                      lead.overallScore >= 80 ? 'bg-red-100 border-red-300' :
                      lead.overallScore >= 50 ? 'bg-amber-100 border-amber-300' :
                      'bg-blue-100 border-blue-300'
                    )}>
                      {lead.overallScore}
                    </div>

                    {/* Lead Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-navy truncate">
                          {lead.firstName} {lead.lastName}
                        </p>
                        <TierIcon className={cn('h-3.5 w-3.5 shrink-0', tier.colorClass)} />
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {lead.serviceType || 'N/A'} · {lead.leadSource} · {lead.status}
                      </p>
                    </div>

                    {/* Score Progress */}
                    <div className="hidden sm:block w-20">
                      <Progress
                        value={lead.overallScore}
                        className={cn(
                          'h-1.5',
                          lead.overallScore >= 80 ? '[&>div]:bg-red-500' :
                          lead.overallScore >= 50 ? '[&>div]:bg-amber-500' :
                          '[&>div]:bg-blue-500'
                        )}
                      />
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="text-navy flex items-center gap-2">
                  Lead Score Breakdown
                </DialogTitle>
                <DialogDescription>
                  {selectedLead.firstName} {selectedLead.lastName} · {selectedLead.email}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                {/* Overall Score */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/40">
                  <div className={cn(
                    'flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-bold text-lg border',
                    selectedLead.overallScore >= 80 ? 'bg-red-100 border-red-300 text-red-600' :
                    selectedLead.overallScore >= 50 ? 'bg-amber-100 border-amber-300 text-amber-600' :
                    'bg-blue-100 border-blue-300 text-blue-600'
                  )}>
                    {selectedLead.overallScore}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">Overall Score</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {(() => {
                        const TierIcon = getScoreTier(selectedLead.overallScore).icon;
                        return <TierIcon className={cn('h-3.5 w-3.5', getScoreTier(selectedLead.overallScore).colorClass)} />;
                      })()}
                      <span className={cn('text-sm font-medium', getScoreTier(selectedLead.overallScore).colorClass)}>
                        {getScoreTier(selectedLead.overallScore).label} Lead
                      </span>
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3">
                  {[
                    { key: 'engagement', label: 'Engagement', icon: Zap },
                    { key: 'sourceQuality', label: 'Source Quality', icon: Target },
                    { key: 'timelineUrgency', label: 'Timeline Urgency', icon: Clock },
                    { key: 'projectValue', label: 'Project Value', icon: DollarSign },
                    { key: 'responseRate', label: 'Response Rate', icon: MessageSquare },
                  ].map(({ key, label, icon: Icon }) => {
                    const metric = selectedLead.breakdown[key as keyof ScoreBreakdown];
                    const pct = Math.round((metric.score / metric.maxScore) * 100);
                    return (
                      <div key={key} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs font-medium text-foreground">{label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{metric.score}/{metric.maxScore}</span>
                        </div>
                        <Progress value={pct} className="h-2" />
                        <p className="text-[11px] text-muted-foreground">{metric.details}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
