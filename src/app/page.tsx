'use client';

import { PublicWebsite } from '@/components/website/PublicWebsite';
import { OwnerDashboard } from '@/components/dashboard/OwnerDashboard';
import { useAppStore } from '@/lib/store';

export default function Home() {
  const { currentView } = useAppStore();

  if (currentView === 'dashboard') {
    return <OwnerDashboard />;
  }

  return <PublicWebsite />;
}
