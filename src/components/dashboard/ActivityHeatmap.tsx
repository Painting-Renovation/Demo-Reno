'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Activity, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ActivityDay {
  date: Date;
  count: number;
  dayOfWeek: number; // 0=Sun, 6=Sat
}

function generateActivityData(): ActivityDay[] {
  const days: ActivityDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate 84 days (12 weeks)
  for (let i = 83; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();

    // More activity on weekdays, less on weekends
    let baseActivity = 0;
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Weekday: higher chance of activity
      const rand = Math.random();
      if (rand < 0.15) baseActivity = 0;
      else if (rand < 0.40) baseActivity = Math.floor(Math.random() * 2) + 1;
      else if (rand < 0.70) baseActivity = Math.floor(Math.random() * 3) + 3;
      else baseActivity = Math.floor(Math.random() * 5) + 6;
    } else {
      // Weekend: lower chance
      const rand = Math.random();
      if (rand < 0.50) baseActivity = 0;
      else if (rand < 0.80) baseActivity = Math.floor(Math.random() * 2) + 1;
      else baseActivity = Math.floor(Math.random() * 3) + 3;
    }

    days.push({
      date: new Date(date),
      count: baseActivity,
      dayOfWeek,
    });
  }

  return days;
}

function getLevelColor(count: number): string {
  if (count === 0) return 'bg-muted-foreground/15';
  if (count <= 2) return 'bg-[#C8973E]/25';
  if (count <= 5) return 'bg-[#C8973E]/55';
  return 'bg-[#C8973E]/90';
}

function getLevelBorder(count: number): string {
  if (count === 0) return 'border-muted-foreground/10';
  if (count <= 2) return 'border-[#C8973E]/15';
  if (count <= 5) return 'border-[#C8973E]/35';
  return 'border-[#C8973E]/70';
}

const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const shortDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ActivityHeatmap() {
  const [days] = useState<ActivityDay[]>(generateActivityData);

  const stats = useMemo(() => {
    const total = days.reduce((sum, d) => sum + d.count, 0);

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate from oldest to newest
    for (let i = 0; i < days.length; i++) {
      if (days[i].count > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    // Current streak (from today going backwards)
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Busiest day
    let busiestDay: ActivityDay | null = null;
    for (const d of days) {
      if (!busiestDay || d.count > busiestDay.count) {
        busiestDay = d;
      }
    }

    return { total, longestStreak, currentStreak, busiestDay };
  }, [days]);

  // Organize days into a grid: columns of 7 (one per day of week), 12 columns for weeks
  // We need to handle the starting day offset
  const weeks: ActivityDay[][] = [];
  let currentWeek: ActivityDay[] = new Array(7).fill(null);

  // Fill leading empty slots for the first week
  const firstDayOfWeek = days[0]?.dayOfWeek ?? 0;
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek[i] = null;
  }

  for (const day of days) {
    currentWeek[day.dayOfWeek] = day;
    if (day.dayOfWeek === 6) {
      weeks.push([...currentWeek]);
      currentWeek = new Array(7).fill(null);
    }
  }
  // Push last partial week
  if (currentWeek.some((d) => d !== null)) {
    weeks.push([...currentWeek]);
  }

  // Compute month labels - one per week column, shown on the first occurrence of that month
  const monthLabels: { label: string; colIndex: number }[] = [];
  const monthSeen = new Set<number>();
  weeks.forEach((week, weekIndex) => {
    for (const day of week) {
      if (day) {
        const monthKey = day.date.getMonth();
        if (!monthSeen.has(monthKey)) {
          monthSeen.add(monthKey);
          monthLabels.push({ label: monthNames[monthKey], colIndex: weekIndex });
        }
      }
    }
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const statCards = [
    {
      icon: Activity,
      label: 'Total Activities',
      value: stats.total.toString(),
      color: 'text-navy',
      bg: 'bg-navy/10',
    },
    {
      icon: TrendingUp,
      label: 'Longest Streak',
      value: `${stats.longestStreak} days`,
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      icon: Calendar,
      label: 'Busiest Day',
      value: stats.busiestDay
        ? stats.busiestDay.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'N/A',
      subValue: stats.busiestDay ? `${stats.busiestDay.count} activities` : undefined,
      color: 'text-sage',
      bg: 'bg-sage/10',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-navy">Activity Heatmap</h2>
        <p className="text-sm text-muted-foreground">
          Your business activity over the last 12 weeks
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat, i) => {
          const StatIcon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('rounded-lg p-2', stat.bg)}>
                      <StatIcon className={cn('h-4 w-4', stat.color)} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-lg font-bold text-navy leading-tight">{stat.value}</p>
                      {stat.subValue && (
                        <p className="text-[11px] text-muted-foreground">{stat.subValue}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Heatmap Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-navy">
                Daily Activity
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-sm bg-muted-foreground/15 border border-muted-foreground/10" />
                  <div className="h-3 w-3 rounded-sm bg-[#C8973E]/25 border border-[#C8973E]/15" />
                  <div className="h-3 w-3 rounded-sm bg-[#C8973E]/55 border border-[#C8973E]/35" />
                  <div className="h-3 w-3 rounded-sm bg-[#C8973E]/90 border border-[#C8973E]/70" />
                </div>
                <span>More</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="overflow-x-auto">
              <div className="inline-flex flex-col gap-0.5 min-w-fit">
                {/* Month Labels */}
                <div className="flex gap-[3px] ml-10 mb-1">
                  {weeks.map((_, weekIndex) => {
                    const monthLabel = monthLabels.find((m) => m.colIndex === weekIndex);
                    return (
                      <div
                        key={weekIndex}
                        className="text-[10px] text-muted-foreground"
                        style={{ width: 14 }}
                      >
                        {monthLabel ? monthLabel.label : ''}
                      </div>
                    );
                  })}
                </div>

                {/* Grid Rows (one per day of week) */}
                {[1, 3, 5].map((dayIdx) => (
                  <div key={dayIdx} className="flex items-center gap-[3px]">
                    {/* Day Label */}
                    <div className="w-9 text-[10px] text-muted-foreground text-right pr-2 shrink-0">
                      {dayLabels[dayIdx] || shortDayLabels[dayIdx]}
                    </div>
                    {/* Day Cells */}
                    {weeks.map((week, weekIndex) => {
                      const day = week[dayIdx];
                      return (
                        <Tooltip key={`${weekIndex}-${dayIdx}`}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                'rounded-sm transition-all duration-150 hover:ring-2 hover:ring-gold/40 hover:scale-110',
                                day ? getLevelColor(day.count) : 'bg-transparent',
                                day ? getLevelBorder(day.count) : 'border border-transparent'
                              )}
                              style={{ width: 13, height: 13 }}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            {day
                              ? `${formatDate(day.date)}: ${day.count} activit${day.count === 1 ? 'y' : 'ies'}`
                              : 'No data'}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
