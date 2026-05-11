import { NextRequest, NextResponse } from 'next/server';

// Mock audit data generator
function generateAuditData() {
  const now = new Date();
  const previousDate = new Date(now.getTime() - 7 * 86400000);

  return {
    overallScore: 78,
    seoScore: 82,
    performanceScore: 71,
    accessibilityScore: 85,
    contentScore: 74,
    mobileScore: 88,
    securityScore: 92,
    lastAuditDate: now.toISOString(),
    previousAuditDate: previousDate.toISOString(),
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
      { id: '1', title: 'Add Schema Markup', description: 'Implement JSON-LD structured data for LocalBusiness, Service, and FAQ schemas.', severity: 'critical', category: 'SEO', impact: '+8-12% CTR in search results' },
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

// GET /api/site-audit — return latest audit results
export async function GET() {
  try {
    const auditData = generateAuditData();
    return NextResponse.json(auditData);
  } catch (error) {
    console.error('GET /api/site-audit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/site-audit — trigger a new audit (returns mock results after a delay)
export async function POST() {
  try {
    // Simulate audit processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const auditData = generateAuditData();
    // Slightly vary the scores to simulate a fresh audit
    const variance = () => Math.floor(Math.random() * 5) - 2;
    auditData.overallScore = Math.max(50, Math.min(100, auditData.overallScore + variance()));
    auditData.seoScore = Math.max(50, Math.min(100, auditData.seoScore + variance()));
    auditData.performanceScore = Math.max(50, Math.min(100, auditData.performanceScore + variance()));
    auditData.accessibilityScore = Math.max(50, Math.min(100, auditData.accessibilityScore + variance()));
    auditData.contentScore = Math.max(50, Math.min(100, auditData.contentScore + variance()));
    auditData.mobileScore = Math.max(50, Math.min(100, auditData.mobileScore + variance()));
    auditData.securityScore = Math.max(50, Math.min(100, auditData.securityScore + variance()));

    return NextResponse.json(auditData);
  } catch (error) {
    console.error('POST /api/site-audit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
