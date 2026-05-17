'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Calendar,
  List,
  Plus,
  Clock,
  MoreHorizontal,
  Eye,
  Trash2,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Appointment {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  serviceType: string | null;
  notes: string | null;
  date: string;
  duration: number;
  status: string;
}

const statusOptions = ['all', 'scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'];

const statusClassMap: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  'in-progress': 'bg-amber-100 text-amber-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

const emptyAppointment = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  serviceType: '',
  notes: '',
  date: '',
  duration: 60,
};

export default function AppointmentsTab() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState(emptyAppointment);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await fetch(`/api/appointments?${params}`);
      const data = await res.json();
      setAppointments(data.data || data || []);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const handleCreate = async () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.date) errors.date = 'Date is required';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setCreateOpen(false);
      setFormData(emptyAppointment);
      setFormErrors({});
      fetchAppointments();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;
    try {
      await fetch(`/api/appointments/${selectedAppointment.id}`, { method: 'DELETE' });
      setDeleteOpen(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Calendar View
  if (viewMode === 'calendar') {
    const appointmentsByDate = new Map<string, Appointment[]>();
    appointments.forEach((apt) => {
      const dateKey = new Date(apt.date).toLocaleDateString();
      if (!appointmentsByDate.has(dateKey)) appointmentsByDate.set(dateKey, []);
      appointmentsByDate.get(dateKey)!.push(apt);
    });

    const sortedDates = Array.from(appointmentsByDate.keys()).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-navy">Appointments</h2>
            <p className="text-sm text-muted-foreground">{appointments.length} total appointments</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-muted rounded-lg p-0.5">
              <Button
                variant={(viewMode as string) === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="h-8"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={(viewMode as string) === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                className="h-8"
                onClick={() => setViewMode('calendar')}
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s === 'all' ? 'All Statuses' : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="bg-gold hover:bg-gold-light text-white" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" />
              New
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {sortedDates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No appointments found
              </CardContent>
            </Card>
          ) : (
            sortedDates.map((dateKey) => (
              <Card key={dateKey} className="dashboard-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-navy">{dateKey}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {appointmentsByDate.get(dateKey)!.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3 cursor-pointer hover:bg-muted/50 gap-2"
                      onClick={() => { setSelectedAppointment(apt); setDetailOpen(true); }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-center shrink-0">
                          <p className="text-sm font-semibold text-navy">{formatTime(apt.date)}</p>
                          <p className="text-xs text-muted-foreground">{apt.duration} min</p>
                        </div>
                        <div className="h-8 w-px bg-border hidden sm:block" />
                        <div>
                          <p className="text-sm font-medium">
                            {apt.firstName} {apt.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {apt.serviceType || 'General'} · {apt.address || 'No address'}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className={cn('text-xs capitalize', statusClassMap[apt.status])}>
                        {apt.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Detail Dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <AppointmentDetailDialog
            appointment={selectedAppointment}
            onUpdateStatus={handleUpdateStatus}
          />
        </Dialog>

        {/* Create Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="max-w-lg sm:max-w-lg w-[calc(100%-2rem)]">
            <DialogHeader>
              <DialogTitle>New Appointment</DialogTitle>
              <DialogDescription>Schedule a new client appointment</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                  {formErrors.firstName && <p className="text-xs text-destructive">{formErrors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  {formErrors.lastName && <p className="text-xs text-destructive">{formErrors.lastName}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <Select value={formData.serviceType} onValueChange={(v) => setFormData({ ...formData, serviceType: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Interior Painting">Interior Painting</SelectItem>
                      <SelectItem value="Exterior Painting">Exterior Painting</SelectItem>
                      <SelectItem value="Cabinet Refinishing">Cabinet Refinishing</SelectItem>
                      <SelectItem value="Commercial Painting">Commercial Painting</SelectItem>
                      <SelectItem value="Deck & Fence">Deck &amp; Fence</SelectItem>
                      <SelectItem value="Wallpaper">Wallpaper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date & Time *</Label>
                  <Input type="datetime-local" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                  {formErrors.date && <p className="text-xs text-destructive">{formErrors.date}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Duration (min)</Label>
                  <Input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setCreateOpen(false); setFormData(emptyAppointment); setFormErrors({}); }}>Cancel</Button>
              <Button className="bg-navy hover:bg-navy-light" onClick={handleCreate} disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Appointment'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this appointment? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-navy">Appointments</h2>
          <p className="text-sm text-muted-foreground">{appointments.length} total appointments</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-muted rounded-lg p-0.5">
            <Button
              variant={(viewMode as string) === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={(viewMode as string) === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s === 'all' ? 'All Statuses' : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="bg-gold hover:bg-gold-light text-white" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="dashboard-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Client</TableHead>
                <TableHead className="text-xs">Service</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Duration</TableHead>
                <TableHead className="text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No appointments found
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((apt) => (
                  <TableRow
                    key={apt.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => { setSelectedAppointment(apt); setDetailOpen(true); }}
                  >
                    <TableCell>
                      <div className="text-sm font-medium">{formatDate(apt.date)}</div>
                      <div className="text-xs text-muted-foreground">{formatTime(apt.date)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{apt.firstName} {apt.lastName}</div>
                      <div className="text-xs text-muted-foreground">{apt.email}</div>
                    </TableCell>
                    <TableCell className="text-sm">{apt.serviceType || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn('text-xs capitalize', statusClassMap[apt.status])}
                      >
                        {apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {apt.duration} min
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedAppointment(apt); setDetailOpen(true); }}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => { e.stopPropagation(); setSelectedAppointment(apt); setDeleteOpen(true); }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg sm:max-w-lg w-[calc(100%-2rem)]">
          <DialogHeader>
            <DialogTitle>New Appointment</DialogTitle>
            <DialogDescription>Schedule a new client appointment</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                {formErrors.firstName && <p className="text-xs text-destructive">{formErrors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                {formErrors.lastName && <p className="text-xs text-destructive">{formErrors.lastName}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Select value={formData.serviceType} onValueChange={(v) => setFormData({ ...formData, serviceType: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Interior Painting">Interior Painting</SelectItem>
                    <SelectItem value="Exterior Painting">Exterior Painting</SelectItem>
                    <SelectItem value="Cabinet Refinishing">Cabinet Refinishing</SelectItem>
                    <SelectItem value="Commercial Painting">Commercial Painting</SelectItem>
                    <SelectItem value="Deck & Fence">Deck &amp; Fence</SelectItem>
                    <SelectItem value="Wallpaper">Wallpaper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date & Time *</Label>
                <Input type="datetime-local" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                {formErrors.date && <p className="text-xs text-destructive">{formErrors.date}</p>}
              </div>
              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); setFormData(emptyAppointment); setFormErrors({}); }}>Cancel</Button>
            <Button className="bg-navy hover:bg-navy-light" onClick={handleCreate} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Appointment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <AppointmentDetailDialog
          appointment={selectedAppointment}
          onUpdateStatus={handleUpdateStatus}
        />
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AppointmentDetailDialog({
  appointment,
  onUpdateStatus,
}: {
  appointment: Appointment | null;
  onUpdateStatus: (id: string, status: string) => void;
}) {
  if (!appointment) return null;

  const statusTransitions: Record<string, string[]> = {
    scheduled: ['confirmed', 'cancelled'],
    confirmed: ['in-progress', 'cancelled'],
    'in-progress': ['completed', 'cancelled'],
    completed: [],
    cancelled: ['scheduled'],
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>
          {appointment.firstName} {appointment.lastName}
        </DialogTitle>
        <DialogDescription>
          {new Date(appointment.date).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
          })} at{' '}
          {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 mt-2">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{appointment.duration} minutes</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{appointment.email}</span>
        </div>
        {appointment.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.phone}</span>
          </div>
        )}
        {appointment.address && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.address}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Service:</span>
          <Badge variant="secondary">{appointment.serviceType || 'General'}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant="secondary" className={cn('capitalize', statusClassMap[appointment.status])}>
            {appointment.status}
          </Badge>
        </div>
        {appointment.notes && (
          <div>
            <p className="text-sm font-medium mb-1">Notes</p>
            <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3">{appointment.notes}</p>
          </div>
        )}

        {/* Quick Status Actions */}
        {statusTransitions[appointment.status]?.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {statusTransitions[appointment.status].map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant="outline"
                  className="capitalize text-xs"
                  onClick={() => onUpdateStatus(appointment.id, s)}
                >
                  Mark {s}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
}
