'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ShieldCheck,
  Search,
  Gauge,
  Eye,
  FileText,
  Smartphone,
  Lock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  TrendingUp,
  Globe,
  Image,
  Heading,
  Link2,
  Zap,
  AlertOctagon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ── Types ──────────────────────────────────────────
interface AuditResult {
  overallScore: number;
  seoScore: number;
  performanceScore: number;
  accessibilityScore: number;
  contentScore: number;
  mobileScore: number;
  securityScore: number;
  lastAuditDate: string;
  previousAuditDate: string;
  previousOverallScore: number;
  seoDetails: SeoDetail[];
  performanceMetrics: PerformanceMetric[];
  accessibilityChecks: AccessibilityCheck[];
  contentAnalysis: ContentAnalysis;
  mobileChecks: MobileCheck[];
  securityChecks: SecurityCheck[];
  actionItems: ActionItem[];
  trendData: TrendDataPoint[];
  categoryComparison: CategoryComparison[];
}

interface SeoDetail {
  label: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
}

interface PerformanceMetric {
  label: string;
  value: number;
  unit: string;
  target: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

interface AccessibilityCheck {
  label: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  wcagLevel: string;
}

interface ContentAnalysis {
  wordCount: number;
  avgReadingLevel: string;
  keywordDensity: KeywordDensity[];
  headingCount: { h1: number; h2: number; h3: number; h4: number };
  imageAltCoverage: number;
  internalLinks: number;
  externalLinks: number;
}

interface KeywordDensity {
  keyword: string;
  count: number;
  density: number;
}

interface MobileCheck {
  label: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
}

interface SecurityCheck {
  label: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  impact: string;
}

interface TrendDataPoint {
  date: string;
  overall: number;
  seo: number;
  performance: number;
  accessibility: number;
}

interface CategoryComparison {
  category: string;
  current: number;
  previous: number;
}

// ── Mock Data ──────────────────────────────────────
function generateMockAudit(): AuditResult {
  return {
    overallScore: 78,
    seoScore: 82,
    performanceScore: 71,
    accessibilityScore: 85,
    contentScore: 74,
    mobileScore: 88,
    securityScore: 92,
    lastAuditDate: new Date().toISOString(),
    previousAuditDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    previousOverallScore: 72,
    seoDetails: [
      { label: 'Title Tag', status: 'pass', description: 'Title tag is present and optimized (55 characters)' },
      { label: 'Meta Description', status: 'pass', description: 'Meta description is within 120-160 characters' },
      { label: 'H1 Tag Structure', status: 'pass', description: 'Single H1 tag found with primary keyword' },
      { label: 'H2-H6 Hierarchy', status: 'pass', description: 'Proper heading hierarchy maintained' },
      { label: 'Image Alt Text', status: 'warning', description: '3 of 12 images are missing alt text' },
      { label: 'Canonical URL', status: 'pass', description: 'Canonical URL properly set' },
      { label: 'Open Graph Tags', status: 'pass', description: 'OG title, description, and image present' },
      { label: 'Twitter Cards', status: 'pass', description: 'Twitter card meta tags configured' },
      { label: 'Robots Meta', status: 'pass', description: 'Robots meta tag allows indexing' },
      { label: 'XML Sitemap', status: 'warning', description: 'Sitemap found but not submitted to Google Search Console' },
      { label: 'Schema Markup', status: 'fail', description: 'No structured data (JSON-LD) found on key pages' },
      { label: 'URL Structure', status: 'pass', description: 'Clean URLs with proper slug format' },
    ],
    performanceMetrics: [
      { label: 'First Contentful Paint', value: 1.2, unit: 's', target: 1.8, rating: 'good' },
      { label: 'Largest Contentful Paint', value: 2.8, unit: 's', target: 2.5, rating: 'needs-improvement' },
      { label: 'Total Blocking Time', value: 180, unit: 'ms', target: 200, rating: 'good' },
      { label: 'Cumulative Layout Shift', value: 0.08, unit: '', target: 0.1, rating: 'good' },
      { label: 'Speed Index', value: 3.2, unit: 's', target: 3.4, rating: 'good' },
      { label: 'Time to Interactive', value: 3.8, unit: 's', target: 3.8, rating: 'needs-improvement' },
      { label: 'Server Response Time', value: 420, unit: 'ms', target: 200, rating: 'needs-improvement' },
      { label: 'DOM Size', value: 892, unit: 'nodes', target: 1500, rating: 'good' },
    ],
    accessibilityChecks: [
      { label: 'Color Contrast Ratio', status: 'pass', description: 'All text meets WCAG AA contrast requirements', wcagLevel: 'AA' },
      { label: 'Form Labels', status: 'pass', description: 'All form inputs have associated labels', wcagLevel: 'A' },
      { label: 'Keyboard Navigation', status: 'pass', description: 'All interactive elements are keyboard accessible', wcagLevel: 'A' },
      { label: 'Focus Indicators', status: 'pass', description: 'Visible focus states on all interactive elements', wcagLevel: 'AA' },
      { label: 'ARIA Attributes', status: 'warning', description: '2 elements have missing ARIA roles', wcagLevel: 'AA' },
      { label: 'Alt Text Coverage', status: 'warning', description: '75% of images have alt text (target: 100%)', wcagLevel: 'A' },
      { label: 'Skip Navigation Link', status: 'pass', description: 'Skip-to-content link present', wcagLevel: 'A' },
      { label: 'Language Attribute', status: 'pass', description: 'HTML lang attribute correctly set', wcagLevel: 'A' },
      { label: 'Heading Hierarchy', status: 'pass', description: 'Headings follow logical order', wcagLevel: 'AA' },
      { label: 'Link Purpose', status: 'warning', description: '3 links have ambiguous link text ("click here")', wcagLevel: 'AA' },
    ],
    contentAnalysis: {
      wordCount: 4820,
      avgReadingLevel: '8th Grade',
      keywordDensity: [
        { keyword: 'painting', count: 42, density: 0.87 },
        { keyword: 'interior painting', count: 18, density: 0.37 },
        { keyword: 'exterior painting', count: 15, density: 0.31 },
        { keyword: 'Toronto', count: 28, density: 0.58 },
        { keyword: 'painters', count: 22, density: 0.46 },
        { keyword: 'residential', count: 12, density: 0.25 },
        { keyword: 'professional', count: 16, density: 0.33 },
        { keyword: 'cabinet refinishing', count: 8, density: 0.17 },
      ],
      headingCount: { h1: 6, h2: 18, h3: 12, h4: 4 },
      imageAltCoverage: 75,
      internalLinks: 24,
      externalLinks: 6,
    },
    mobileChecks: [
      { label: 'Viewport Meta Tag', status: 'pass', description: 'Viewport meta tag correctly configured' },
      { label: 'Touch Targets', status: 'pass', description: 'All interactive elements meet 44px minimum touch target' },
      { label: 'Responsive Layout', status: 'pass', description: 'Layout adapts correctly across breakpoints' },
      { label: 'Font Sizes', status: 'pass', description: 'Minimum font size of 14px maintained on mobile' },
      { label: 'Horizontal Scroll', status: 'warning', description: 'Minor horizontal overflow detected on gallery page' },
      { label: 'Mobile Performance', status: 'pass', description: 'Page loads in under 4 seconds on 3G connection' },
      { label: 'Plugin Compatibility', status: 'pass', description: 'No Flash or unsupported plugins detected' },
    ],
    securityChecks: [
      { label: 'HTTPS', status: 'pass', description: 'SSL certificate is valid and HTTPS is enforced' },
      { label: 'Mixed Content', status: 'pass', description: 'No mixed HTTP/HTTPS content detected' },
      { label: 'Security Headers', status: 'warning', description: 'Missing X-Content-Type-Options header' },
      { label: 'Content Security Policy', status: 'pass', description: 'CSP header properly configured' },
      { label: 'X-Frame-Options', status: 'pass', description: 'X-Frame-Options set to DENY' },
      { label: 'HSTS', status: 'pass', description: 'Strict-Transport-Security header configured' },
      { label: 'No Console Errors', status: 'pass', description: 'Zero JavaScript console errors on load' },
      { label: 'Outdated Libraries', status: 'warning', description: '1 dependency has a minor vulnerability (non-critical)' },
    ],
    actionItems: [
      { id: '1', title: 'Add Schema Markup', description: 'Implement JSON-LD structured data for LocalBusiness, Service, and FAQ schemas to improve search visibility.', severity: 'critical', category: 'SEO', impact: '+8-12% CTR in search results' },
      { id: '2', title: 'Optimize Largest Contentful Paint', description: 'Compress and serve hero images in WebP format. Consider lazy loading below-the-fold images.', severity: 'warning', category: 'Performance', impact: 'Reduce LCP by 0.8s' },
      { id: '3', title: 'Fix Missing Alt Text', description: 'Add descriptive alt attributes to 3 images in the gallery section for better accessibility.', severity: 'warning', category: 'Accessibility', impact: 'Improve WCAG compliance to 95%' },
      { id: '4', title: 'Add Security Header', description: 'Include X-Content-Type-Options: nosniff header in server configuration.', severity: 'info', category: 'Security', impact: 'Prevent MIME-type sniffing' },
      { id: '5', title: 'Submit Sitemap to GSC', description: 'Submit XML sitemap to Google Search Console for faster indexing.', severity: 'info', category: 'SEO', impact: 'Faster page discovery' },
      { id: '6', title: 'Fix Ambiguous Link Text', description: 'Replace "click here" text with descriptive alternatives in 3 locations.', severity: 'info', category: 'Accessibility', impact: 'Better screen reader experience' },
      { id: '7', title: 'Reduce Server Response Time', description: 'Optimize database queries and implement caching for static pages.', severity: 'warning', category: 'Performance', impact: 'Reduce TTFB by 200ms' },
      { id: '8', title: 'Fix Gallery Overflow', description: 'Fix horizontal scroll issue on gallery page on mobile devices.', severity: 'info', category: 'Mobile', impact: 'Improved mobile UX' },
    ],
    trendData: [
      { date: 'Week 1', overall: 62, seo: 68, performance: 55, accessibility: 72 },
      { date: 'Week 2', overall: 65, seo: 71, performance: 58, accessibility: 74 },
      { date: 'Week 3', overall: 68, seo: 73, performance: 62, accessibility: 76 },
      { date: 'Week 4', overall: 71, seo: 76, performance: 66, accessibility: 79 },
      { date: 'Week 5', overall: 72, seo: 78, performance: 68, accessibility: 81 },
      { date: 'Week 6', overall: 75, seo: 80, performance: 69, accessibility: 83 },
      { date: 'Week 7', overall: 78, seo: 82, performance: 71, accessibility: 85 },
    ],
    categoryComparison: [
      { category: 'SEO', current: 82, previous: 78 },
      { category: 'Performance', current: 71, previous: 69 },
      { category: 'Accessibility', current: 85, previous: 83 },
      { category: 'Content', current: 74, previous: 70 },
      { category: 'Mobile', current: 88, previous: 86 },
      { category: 'Security', current: 92, previous: 91 },
    ],
  };
}

// ── Circular Progress ──────────────────────────────
function CircularProgress({ score, size = 140, strokeWidth = 10 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return '#22c55e';
    if (s >= 60) return '#f59e0b';
    if (s >= 40) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold text-navy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

// ── Status Icon ────────────────────────────────────
function StatusIcon({ status }: { status: 'pass' | 'fail' | 'warning' }) {
  switch (status) {
    case 'pass':
      return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />;
    case 'fail':
      return <XCircle className="h-4 w-4 text-red-500 shrink-0" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
  }
}

// ── Score Badge ────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const colorClass = score >= 80 ? 'bg-green-100 text-green-800' : score >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800';
  return <Badge variant="secondary" className={cn('text-xs font-bold', colorClass)}>{score}/100</Badge>;
}

// ── Component ──────────────────────────────────────
export default function SiteAuditTab() {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningAudit, setRunningAudit] = useState(false);

  const fetchAudit = async () => {
    try {
      const res = await fetch('/api/site-audit');
      if (res.ok) {
        const data = await res.json();
        setAudit(data);
      } else {
        setAudit(generateMockAudit());
      }
    } catch {
      setAudit(generateMockAudit());
    } finally {
      setLoading(false);
    }
  };

  const runAudit = async () => {
    setRunningAudit(true);
    try {
      const res = await fetch('/api/site-audit', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setAudit(data);
      } else {
        // Simulate delay and use mock data
        await new Promise((resolve) => setTimeout(resolve, 2500));
        setAudit(generateMockAudit());
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setAudit(generateMockAudit());
    } finally {
      setRunningAudit(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  const scoreDiff = audit ? audit.overallScore - audit.previousOverallScore : 0;

  const severityConfig = {
    critical: { icon: AlertOctagon, class: 'bg-red-100 text-red-800 border-red-200' },
    warning: { icon: AlertTriangle, class: 'bg-amber-100 text-amber-800 border-amber-200' },
    info: { icon: Info, class: 'bg-blue-100 text-blue-800 border-blue-200' },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (!audit) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" />
            Site Audit
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive website health analysis
            {audit.lastAuditDate && (
              <span className="ml-1">
                · Last audit: {new Date(audit.lastAuditDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <Button
          onClick={runAudit}
          disabled={runningAudit}
          className="bg-navy hover:bg-navy-light text-white min-w-[140px]"
        >
          <RefreshCw className={cn('h-4 w-4 mr-2', runningAudit && 'animate-spin')} />
          {runningAudit ? 'Running Audit...' : 'Run New Audit'}
        </Button>
      </div>

      {/* Score Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Score */}
        <Card className="dashboard-card">
          <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
            <CircularProgress score={audit.overallScore} />
            <div className="text-center">
              <p className="text-lg font-semibold text-navy">Overall Health Score</p>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                {scoreDiff > 0 ? (
                  <>
                    <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-sm font-medium text-green-600">+{scoreDiff} pts</span>
                  </>
                ) : scoreDiff < 0 ? (
                  <>
                    <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                    <span className="text-sm font-medium text-red-500">{scoreDiff} pts</span>
                  </>
                ) : (
                  <>
                    <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">No change</span>
                  </>
                )}
                <span className="text-xs text-muted-foreground">vs last audit</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Scores */}
        <Card className="dashboard-card md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-navy">Category Scores</CardTitle>
            <CardDescription>Score breakdown by category with trend comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'SEO', score: audit.seoScore, icon: Search, diff: audit.seoScore - (audit.categoryComparison.find(c => c.category === 'SEO')?.previous || audit.seoScore) },
                { label: 'Performance', score: audit.performanceScore, icon: Gauge, diff: audit.categoryComparison.find(c => c.category === 'Performance') ? audit.performanceScore - audit.categoryComparison.find(c => c.category === 'Performance')!.previous : 0 },
                { label: 'Accessibility', score: audit.accessibilityScore, icon: Eye, diff: audit.accessibilityScore - (audit.categoryComparison.find(c => c.category === 'Accessibility')?.previous || audit.accessibilityScore) },
                { label: 'Content', score: audit.contentScore, icon: FileText, diff: audit.contentScore - (audit.categoryComparison.find(c => c.category === 'Content')?.previous || audit.contentScore) },
                { label: 'Mobile', score: audit.mobileScore, icon: Smartphone, diff: audit.mobileScore - (audit.categoryComparison.find(c => c.category === 'Mobile')?.previous || audit.mobileScore) },
                { label: 'Security', score: audit.securityScore, icon: Lock, diff: audit.securityScore - (audit.categoryComparison.find(c => c.category === 'Security')?.previous || audit.securityScore) },
              ].map((cat) => {
                const Icon = cat.icon;
                return (
                  <motion.div
                    key={cat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-2 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">{cat.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {cat.diff > 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-green-500" />
                        ) : cat.diff < 0 ? (
                          <ArrowDownRight className="h-3 w-3 text-red-500" />
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={cat.score} className="h-2 flex-1" />
                      <span className="text-sm font-bold text-navy w-8 text-right">{cat.score}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed analysis */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/40 p-1">
          <TabsTrigger value="performance" className="text-xs sm:text-sm">
            <Gauge className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="seo" className="text-xs sm:text-sm">
            <Search className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="text-xs sm:text-sm">
            <Eye className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
            Accessibility
          </TabsTrigger>
          <TabsTrigger value="content" className="text-xs sm:text-sm">
            <FileText className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
            Content
          </TabsTrigger>
          <TabsTrigger value="mobile" className="text-xs sm:text-sm">
            <Smartphone className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
            Mobile
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm">
            <Lock className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
            Security
          </TabsTrigger>
          <TabsTrigger value="actions" className="text-xs sm:text-sm">
            <Zap className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
            Actions
          </TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dashboard-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-navy">Core Web Vitals</CardTitle>
                <CardDescription>Lighthouse performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {audit.performanceMetrics.map((metric) => (
                  <div key={metric.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{metric.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {metric.value}{metric.unit}
                        </span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-[10px]',
                            metric.rating === 'good' ? 'bg-green-100 text-green-800' :
                            metric.rating === 'needs-improvement' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          )}
                        >
                          {metric.rating === 'good' ? 'Good' : metric.rating === 'needs-improvement' ? 'Fair' : 'Poor'}
                        </Badge>
                      </div>
                    </div>
                    <Progress
                      value={Math.min(100, ((metric.unit === 's' ? metric.target / metric.value : metric.target / metric.value) * 100))}
                      className={cn(
                        'h-2',
                        metric.rating === 'good' ? '[&>div]:bg-green-500' :
                        metric.rating === 'needs-improvement' ? '[&>div]:bg-amber-500' :
                        '[&>div]:bg-red-500'
                      )}
                    />
                    <p className="text-[11px] text-muted-foreground">Target: {metric.target}{metric.unit}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-navy flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Score Trend
                </CardTitle>
                <CardDescription>Weekly audit score progression</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={audit.trendData}>
                      <defs>
                        <linearGradient id="overallGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0B1D3A" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#0B1D3A" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C8973E" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#C8973E" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                      />
                      <Area type="monotone" dataKey="overall" stroke="#0B1D3A" fill="url(#overallGrad)" strokeWidth={2} name="Overall" />
                      <Area type="monotone" dataKey="performance" stroke="#C8973E" fill="url(#perfGrad)" strokeWidth={2} name="Performance" />
                      <Area type="monotone" dataKey="seo" stroke="#5B7B5A" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" name="SEO" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dashboard-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-navy">SEO Checklist</CardTitle>
                <CardDescription>
                  {audit.seoDetails.filter(d => d.status === 'pass').length} of {audit.seoDetails.length} checks passed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[420px]">
                  <div className="space-y-3">
                    {audit.seoDetails.map((detail, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <StatusIcon status={detail.status} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{detail.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{detail.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-navy">Category Comparison</CardTitle>
                <CardDescription>Current vs previous audit scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={audit.categoryComparison} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                      <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Bar dataKey="previous" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Previous" />
                      <Bar dataKey="current" fill="#0B1D3A" radius={[4, 4, 0, 0]} name="Current" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Accessibility Tab */}
        <TabsContent value="accessibility">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dashboard-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-navy">WCAG Compliance</CardTitle>
                <CardDescription>
                  {audit.accessibilityChecks.filter(c => c.status === 'pass').length} of {audit.accessibilityChecks.length} checks passed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[420px]">
                  <div className="space-y-3">
                    {audit.accessibilityChecks.map((check, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <StatusIcon status={check.status} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{check.label}</p>
                            <Badge variant="secondary" className="text-[10px] bg-muted text-muted-foreground">
                              {check.wcagLevel}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{check.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-navy">Radar Overview</CardTitle>
                <CardDescription>Multi-dimensional score visualization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { subject: 'SEO', A: audit.seoScore, fullMark: 100 },
                      { subject: 'Performance', A: audit.performanceScore, fullMark: 100 },
                      { subject: 'Accessibility', A: audit.accessibilityScore, fullMark: 100 },
                      { subject: 'Content', A: audit.contentScore, fullMark: 100 },
                      { subject: 'Mobile', A: audit.mobileScore, fullMark: 100 },
                      { subject: 'Security', A: audit.securityScore, fullMark: 100 },
                    ]}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name="Score" dataKey="A" stroke="#0B1D3A" fill="#0B1D3A" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dashboard-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-navy">Content Metrics</CardTitle>
                <CardDescription>Page content analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/40 text-center">
                    <p className="text-2xl font-bold text-navy">{audit.contentAnalysis.wordCount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Words</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 text-center">
                    <p className="text-2xl font-bold text-navy">{audit.contentAnalysis.avgReadingLevel}</p>
                    <p className="text-xs text-muted-foreground">Reading Level</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 text-center">
                    <p className="text-2xl font-bold text-navy">{audit.contentAnalysis.imageAltCoverage}%</p>
                    <p className="text-xs text-muted-foreground">Alt Text Coverage</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <p className="text-2xl font-bold text-navy">{audit.contentAnalysis.internalLinks + audit.contentAnalysis.externalLinks}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Total Links</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Heading className="h-4 w-4" />
                    Heading Structure
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center p-2 rounded bg-muted/40">
                      <p className="text-lg font-bold text-navy">{audit.contentAnalysis.headingCount.h1}</p>
                      <p className="text-[10px] text-muted-foreground">H1</p>
                    </div>
                    <div className="text-center p-2 rounded bg-muted/40">
                      <p className="text-lg font-bold text-navy">{audit.contentAnalysis.headingCount.h2}</p>
                      <p className="text-[10px] text-muted-foreground">H2</p>
                    </div>
                    <div className="text-center p-2 rounded bg-muted/40">
                      <p className="text-lg font-bold text-navy">{audit.contentAnalysis.headingCount.h3}</p>
                      <p className="text-[10px] text-muted-foreground">H3</p>
                    </div>
                    <div className="text-center p-2 rounded bg-muted/40">
                      <p className="text-lg font-bold text-navy">{audit.contentAnalysis.headingCount.h4}</p>
                      <p className="text-[10px] text-muted-foreground">H4</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-navy">Keyword Density</CardTitle>
                <CardDescription>Top keywords by frequency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={audit.contentAnalysis.keywordDensity} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="keyword" tick={{ fontSize: 10 }} width={120} />
                      <Tooltip
                        contentStyle={{ fontSize: 12, borderRadius: 8 }}
                        formatter={(value: number) => [`${value}%`, 'Density']}
                      />
                      <Bar dataKey="density" fill="#0B1D3A" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mobile Tab */}
        <TabsContent value="mobile">
          <Card className="dashboard-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-navy">Mobile Friendliness</CardTitle>
              <CardDescription>
                {audit.mobileChecks.filter(c => c.status === 'pass').length} of {audit.mobileChecks.length} checks passed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {audit.mobileChecks.map((check, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <StatusIcon status={check.status} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{check.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{check.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="dashboard-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-navy">Security Analysis</CardTitle>
              <CardDescription>
                {audit.securityChecks.filter(c => c.status === 'pass').length} of {audit.securityChecks.length} checks passed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {audit.securityChecks.map((check, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <StatusIcon status={check.status} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{check.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{check.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Action Items Tab */}
        <TabsContent value="actions">
          <Card className="dashboard-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-navy flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Action Items
              </CardTitle>
              <CardDescription>
                {audit.actionItems.filter(a => a.severity === 'critical').length} critical ·{' '}
                {audit.actionItems.filter(a => a.severity === 'warning').length} warnings ·{' '}
                {audit.actionItems.filter(a => a.severity === 'info').length} suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[500px]">
                <div className="space-y-3">
                  {audit.actionItems.map((item, i) => {
                    const config = severityConfig[item.severity];
                    const SeverityIcon = config.icon;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', config.class)}>
                            <SeverityIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-foreground">{item.title}</p>
                              <Badge
                                variant="outline"
                                className={cn('text-[10px] capitalize', config.class)}
                              >
                                {item.severity}
                              </Badge>
                              <Badge variant="secondary" className="text-[10px] bg-muted">
                                {item.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                            <p className="text-xs font-medium text-gold mt-1.5 flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Impact: {item.impact}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Trend Chart */}
      <Card className="dashboard-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-navy">Score History</CardTitle>
          <CardDescription>Weekly trend of all audit categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={audit.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                <Line type="monotone" dataKey="overall" stroke="#0B1D3A" strokeWidth={2.5} dot={{ r: 4 }} name="Overall" />
                <Line type="monotone" dataKey="seo" stroke="#5B7B5A" strokeWidth={1.5} dot={{ r: 3 }} name="SEO" />
                <Line type="monotone" dataKey="performance" stroke="#C8973E" strokeWidth={1.5} dot={{ r: 3 }} name="Performance" />
                <Line type="monotone" dataKey="accessibility" stroke="#8b5cf6" strokeWidth={1.5} dot={{ r: 3 }} name="Accessibility" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
