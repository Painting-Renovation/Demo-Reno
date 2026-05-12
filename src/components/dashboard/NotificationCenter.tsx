'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  UserPlus,
  CalendarCheck,
  FileText,
  ClipboardList,
  Star,
  Check,
  CheckCheck,
  X,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

// ── Types ──────────────────────────────────────────
type NotificationType = 'new-lead' | 'appointment' | 'quote-sent' | 'project-updated' | 'review-received';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionTab?: string;
}

// ── Mock Notifications ─────────────────────────────
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'new-lead',
    title: 'New Lead: Sarah Chen',
    description: 'Submitted an estimate request for interior painting in downtown Toronto.',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    read: false,
    actionTab: 'leads',
  },
  {
    id: '2',
    type: 'appointment',
    title: 'Appointment Confirmed',
    description: 'Mike Thompson confirmed his estimate visit for next Tuesday at 10 AM.',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    read: false,
    actionTab: 'appointments',
  },
  {
    id: '3',
    type: 'review-received',
    title: 'New 5-Star Review!',
    description: 'Emily Rodriguez left a glowing review: "Absolutely transformed our living room!"',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: false,
  },
  {
    id: '4',
    type: 'project-updated',
    title: 'Project Milestone: 75% Complete',
    description: 'The Oakville residence exterior painting project reached the 75% milestone.',
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    read: false,
    actionTab: 'projects',
  },
  {
    id: '5',
    type: 'quote-sent',
    title: 'Quote Sent: Johnson Residence',
    description: 'A $4,850 quote for full interior repaint has been sent to David Johnson.',
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    read: true,
    actionTab: 'quotes',
  },
  {
    id: '6',
    type: 'new-lead',
    title: 'New Lead: Priya Sharma',
    description: 'Requested a quote for cabinet refinishing via the website contact form.',
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
    read: true,
    actionTab: 'leads',
  },
  {
    id: '7',
    type: 'appointment',
    title: 'Appointment Rescheduled',
    description: 'Alex Kim moved their estimate visit to Thursday at 2 PM.',
    timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
    read: true,
    actionTab: 'appointments',
  },
  {
    id: '8',
    type: 'review-received',
    title: 'New Review Received',
    description: 'Tom Baker rated 4 stars: "Great work, professional team. Minor cleanup issue."',
    timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
    read: true,
  },
  {
    id: '9',
    type: 'project-updated',
    title: 'Project Completed',
    description: 'The Mississauga condo repaint project was marked as completed by the team.',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    read: true,
    actionTab: 'projects',
  },
  {
    id: '10',
    type: 'new-lead',
    title: 'New Lead: Robert Williams',
    description: 'Inquired about commercial painting services for a retail space in Etobicoke.',
    timestamp: new Date(Date.now() - 1.5 * 86400000).toISOString(),
    read: true,
    actionTab: 'leads',
  },
  {
    id: '11',
    type: 'quote-sent',
    title: 'Quote Accepted',
    description: 'Lisa Park accepted the $6,200 quote for deck staining and fence painting.',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    read: true,
    actionTab: 'quotes',
  },
  {
    id: '12',
    type: 'appointment',
    title: 'Appointment No-Show',
    description: 'James Cooper did not show up for his scheduled estimate visit.',
    timestamp: new Date(Date.now() - 2.5 * 86400000).toISOString(),
    read: true,
    actionTab: 'appointments',
  },
  {
    id: '13',
    type: 'project-updated',
    title: 'New Project Started',
    description: 'Interior painting for the Morrison residence has begun. Estimated 5-day completion.',
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    read: true,
    actionTab: 'projects',
  },
  {
    id: '14',
    type: 'new-lead',
    title: 'New Lead: Amanda Torres',
    description: 'Requested a color consultation and interior painting quote for a new build.',
    timestamp: new Date(Date.now() - 3.5 * 86400000).toISOString(),
    read: true,
    actionTab: 'leads',
  },
];

// ── Helpers ────────────────────────────────────────
function getTypeConfig(type: NotificationType) {
  switch (type) {
    case 'new-lead':
      return { icon: UserPlus, color: 'bg-blue-100 text-blue-600', badgeClass: 'bg-blue-100 text-blue-800' };
    case 'appointment':
      return { icon: CalendarCheck, color: 'bg-green-100 text-green-600', badgeClass: 'bg-green-100 text-green-800' };
    case 'quote-sent':
      return { icon: FileText, color: 'bg-purple-100 text-purple-600', badgeClass: 'bg-purple-100 text-purple-800' };
    case 'project-updated':
      return { icon: ClipboardList, color: 'bg-amber-100 text-amber-600', badgeClass: 'bg-amber-100 text-amber-800' };
    case 'review-received':
      return { icon: Star, color: 'bg-gold/20 text-gold', badgeClass: 'bg-amber-100 text-amber-800' };
  }
}

function getTypeLabel(type: NotificationType): string {
  switch (type) {
    case 'new-lead': return 'New Lead';
    case 'appointment': return 'Appointment';
    case 'quote-sent': return 'Quote';
    case 'project-updated': return 'Project';
    case 'review-received': return 'Review';
  }
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// ── Component ──────────────────────────────────────
export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);
  const { setDashboardTab } = useAppStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleAction = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionTab) {
      setDashboardTab(notification.actionTab);
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="relative"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      >
        <Bell className={cn('h-5 w-5', unreadCount > 0 ? 'text-navy' : 'text-muted-foreground')} />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </Button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-xl border bg-white shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-navy" />
                <h3 className="text-sm font-semibold text-navy">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-[10px] bg-red-100 text-red-700">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllRead}
                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <CheckCheck className="h-3.5 w-3.5 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Notification List */}
            <ScrollArea className="max-h-[420px]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Bell className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm">No notifications</p>
                  <p className="text-xs mt-0.5">You&apos;re all caught up!</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification, i) => {
                    const typeConfig = getTypeConfig(notification.type);
                    const TypeIcon = typeConfig.icon;
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className={cn(
                          'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/40 relative',
                          !notification.read && 'bg-blue-50/50'
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        {/* Unread indicator */}
                        {!notification.read && (
                          <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-blue-500" />
                        )}

                        {/* Icon */}
                        <div className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full mt-0.5',
                          typeConfig.color
                        )}>
                          <TypeIcon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pl-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              'text-sm leading-snug',
                              !notification.read ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'
                            )}>
                              {notification.title}
                            </p>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge variant="secondary" className={cn('text-[10px]', typeConfig.badgeClass)}>
                              {getTypeLabel(notification.type)}
                            </Badge>
                            {notification.actionTab && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction(notification);
                                }}
                                className="flex items-center gap-1 text-[10px] font-medium text-gold hover:text-gold-light transition-colors"
                              >
                                View <ExternalLink className="h-2.5 w-2.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            <Separator />
            <div className="px-4 py-2.5 flex items-center justify-between bg-muted/20">
              <p className="text-[11px] text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllRead}
                  className="h-6 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Read all
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
