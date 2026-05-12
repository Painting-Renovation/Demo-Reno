'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  User,
  Bell,
  Link2,
  Save,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OwnerProfile {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}

interface NotificationPrefs {
  newLead: boolean;
  newAppointment: boolean;
  quoteSent: boolean;
  projectUpdate: boolean;
  dailySummary: boolean;
  weeklyReport: boolean;
}

interface IntegrationSettings {
  googleEmail: string;
  slackWebhook: string;
}

export default function SettingsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profile, setProfile] = useState<OwnerProfile>({
    name: '',
    email: '',
    phone: '',
    company: 'ProCoat Painters',
    address: '',
  });

  const [notifications, setNotifications] = useState<NotificationPrefs>({
    newLead: true,
    newAppointment: true,
    quoteSent: true,
    projectUpdate: true,
    dailySummary: true,
    weeklyReport: true,
  });

  const [integrations, setIntegrations] = useState<IntegrationSettings>({
    googleEmail: '',
    slackWebhook: '',
  });

  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [ownerRes, notifRes] = await Promise.all([
          fetch('/api/owner'),
          fetch('/api/notifications'),
        ]);

        const ownerData = await ownerRes.json();
        if (ownerData.name) {
          setProfile({
            name: ownerData.name || '',
            email: ownerData.email || '',
            phone: ownerData.phone || '',
            company: ownerData.company || 'ProCoat Painters',
            address: ownerData.address || '',
          });
          setIntegrations({
            googleEmail: ownerData.googleEmail || '',
            slackWebhook: ownerData.slackWebhook || '',
          });
        }

        const notifData = await notifRes.json();
        if (notifData) {
          setNotifications({
            newLead: notifData.newLead ?? true,
            newAppointment: notifData.newAppointment ?? true,
            quoteSent: notifData.quoteSent ?? true,
            projectUpdate: notifData.projectUpdate ?? true,
            dailySummary: notifData.dailySummary ?? true,
            weeklyReport: notifData.weeklyReport ?? true,
          });
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await Promise.all([
        fetch('/api/owner', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...profile,
            googleEmail: integrations.googleEmail,
            slackWebhook: integrations.slackWebhook,
          }),
        }),
        fetch('/api/notifications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notifications),
        }),
      ]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetData = async () => {
    setResetting(true);
    try {
      // This would reset all data - for now just close the dialog
      await new Promise((r) => setTimeout(r, 1000));
      setResetOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 max-w-2xl">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  const toggleItems: Array<{
    key: keyof NotificationPrefs;
    label: string;
    description: string;
    icon: React.ElementType;
  }> = [
    {
      key: 'newLead',
      label: 'New Lead Notifications',
      description: 'Get notified when a new lead is submitted',
      icon: User,
    },
    {
      key: 'newAppointment',
      label: 'Appointment Alerts',
      description: 'Receive alerts for new or updated appointments',
      icon: Bell,
    },
    {
      key: 'quoteSent',
      label: 'Quote Activity',
      description: 'Notifications when quotes are viewed or accepted',
      icon: Bell,
    },
    {
      key: 'projectUpdate',
      label: 'Project Updates',
      description: 'Updates on project status changes',
      icon: Bell,
    },
    {
      key: 'dailySummary',
      label: 'Daily Summary Email',
      description: 'Daily digest of business activity',
      icon: Bell,
    },
    {
      key: 'weeklyReport',
      label: 'Weekly Report',
      description: 'Comprehensive weekly performance report',
      icon: Bell,
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your profile and preferences
          </p>
        </div>
        <Button
          className={cn(
            'min-w-[100px]',
            saveSuccess
              ? 'bg-green-600 hover:bg-green-600 text-white'
              : 'bg-navy hover:bg-navy-light text-white'
          )}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : saveSuccess ? (
            'Saved!'
          ) : (
            <Save className="h-4 w-4 mr-1.5" />
          )}
          {saveSuccess ? 'Saved!' : 'Save'}
        </Button>
      </div>

      {/* Owner Profile */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-gold" />
            Owner Profile
          </CardTitle>
          <CardDescription>Your personal and company information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-gold" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose what you want to be notified about</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {toggleItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.key}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">{item.label}</Label>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, [item.key]: checked })
                    }
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Integration Settings */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link2 className="h-4 w-4 text-gold" />
            Integration Settings
          </CardTitle>
          <CardDescription>Connect external services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google-email">Google Calendar Email</Label>
            <Input
              id="google-email"
              type="email"
              placeholder="your-email@gmail.com"
              value={integrations.googleEmail}
              onChange={(e) =>
                setIntegrations({ ...integrations, googleEmail: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Used for syncing appointments to Google Calendar
            </p>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
            <Input
              id="slack-webhook"
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={integrations.slackWebhook}
              onChange={(e) =>
                setIntegrations({ ...integrations, slackWebhook: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Receive notifications in your Slack channel
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div>
              <p className="text-sm font-medium text-destructive">Reset All Data</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete all leads, projects, quotes, and appointments
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setResetOpen(true)}
            >
              Reset Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Reset All Data
            </DialogTitle>
            <DialogDescription>
              This will permanently delete all your leads, projects, quotes, appointments, and
              analytics data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
            <p className="text-sm font-medium text-destructive">Are you absolutely sure?</p>
            <p className="text-xs text-muted-foreground mt-1">
              All business data will be lost. Consider exporting your data before proceeding.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetData} disabled={resetting}>
              {resetting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Yes, Reset Everything'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
