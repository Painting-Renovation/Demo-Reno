'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
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
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  ClipboardList,
  Save,
  MessageSquare,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import LeadScoringPanel from './LeadScoringPanel';
import { cn } from '@/lib/utils';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  serviceType: string | null;
  status: string;
  priority: string;
  funnelStage: string;
  notes: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  projectDesc: string | null;
  budget: string | null;
  howHeard: string | null;
  leadSource: string;
  estimatedValue: number | null;
  createdAt: string;
  updatedAt: string;
  activities?: LeadActivity[];
}

interface LeadActivity {
  id: string;
  type: string;
  description: string;
  outcome: string | null;
  createdAt: string;
}

const statusOptions = ['all', 'new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
const statusClassMap: Record<string, string> = {
  new: 'status-new',
  contacted: 'status-contacted',
  qualified: 'status-qualified',
  proposal: 'status-proposal',
  won: 'status-won',
  lost: 'status-lost',
};

const priorityClassMap: Record<string, string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export default function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editStatusOpen, setEditStatusOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [leadNotes, setLeadNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();
      setLeads(data.data || data || []);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const columns = useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-1 h-3.5 w-3.5" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-1 h-3.5 w-3.5" />
            ) : (
              <ChevronsUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.firstName} {row.original.lastName}
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{row.original.email}</span>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => (
          <span className="text-sm">{row.original.phone || '—'}</span>
        ),
      },
      {
        accessorKey: 'serviceType',
        header: 'Service',
        cell: ({ row }) => (
          <span className="text-sm">{row.original.serviceType || 'N/A'}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            variant="secondary"
            className={cn('text-xs capitalize', statusClassMap[row.original.status] || '')}
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: 'funnelStage',
        header: 'Funnel Stage',
        cell: ({ row }) => (
          <span className="text-xs capitalize text-muted-foreground">
            {row.original.funnelStage || 'awareness'}
          </span>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => (
          <Badge
            variant="secondary"
            className={cn('text-xs capitalize', priorityClassMap[row.original.priority] || '')}
          >
            {row.original.priority}
          </Badge>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-1 h-3.5 w-3.5" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-1 h-3.5 w-3.5" />
            ) : (
              <ChevronsUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openDetail(row.original)}>
                <Eye className="mr-2 h-4 w-4" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditStatus(row.original)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit Status
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => { setSelectedLead(row.original); setDeleteOpen(true); }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: leads,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const openDetail = async (lead: Lead) => {
    setSelectedLead(lead);
    setLeadNotes(lead.notes || '');
    setDetailOpen(true);
    // Fetch activities
    try {
      const res = await fetch(`/api/leads/${lead.id}`);
      const data = await res.json();
      if (data.activities) {
        setSelectedLead({ ...lead, activities: data.activities });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditStatus = (lead: Lead) => {
    setSelectedLead(lead);
    setNewStatus(lead.status);
    setEditStatusOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedLead) return;
    try {
      await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setEditStatusOpen(false);
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedLead) return;
    try {
      await fetch(`/api/leads/${selectedLead.id}`, { method: 'DELETE' });
      setDeleteOpen(false);
      setSelectedLead(null);
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setSavingNotes(true);
    try {
      await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: leadNotes }),
      });
      setSelectedLead({ ...selectedLead, notes: leadNotes });
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-navy">Leads</h2>
          <p className="text-sm text-muted-foreground">{leads.length} total leads</p>
        </div>
        <Button className="bg-gold hover:bg-gold-light text-white">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Lead
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status === 'all' ? 'All Statuses' : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lead Scoring Panel */}
      <LeadScoringPanel leads={leads} onScored={fetchLeads} />

      {/* Table */}
      <Card className="dashboard-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-xs">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-12 text-muted-foreground">
                    No leads found
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openDetail(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Lead Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="text-navy">
                  {selectedLead.firstName} {selectedLead.lastName}
                </DialogTitle>
                <DialogDescription>{selectedLead.email} · {selectedLead.phone || 'No phone'}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge
                    variant="secondary"
                    className={cn('mt-1 text-xs capitalize', statusClassMap[selectedLead.status] || '')}
                  >
                    {selectedLead.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Priority</Label>
                  <Badge
                    variant="secondary"
                    className={cn('mt-1 text-xs capitalize', priorityClassMap[selectedLead.priority] || '')}
                  >
                    {selectedLead.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Service</Label>
                  <p className="text-sm mt-0.5">{selectedLead.serviceType || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Source</Label>
                  <p className="text-sm mt-0.5 capitalize">{selectedLead.leadSource}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Funnel Stage</Label>
                  <p className="text-sm mt-0.5 capitalize">{selectedLead.funnelStage}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Budget</Label>
                  <p className="text-sm mt-0.5">{selectedLead.budget || 'N/A'}</p>
                </div>
                {selectedLead.address && (
                  <div className="col-span-2">
                    <Label className="text-xs text-muted-foreground">Address</Label>
                    <p className="text-sm mt-0.5">
                      {selectedLead.address}{selectedLead.city ? `, ${selectedLead.city}` : ''}
                      {selectedLead.postalCode ? ` ${selectedLead.postalCode}` : ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Notes</Label>
                <div className="flex gap-2">
                  <Textarea
                    value={leadNotes}
                    onChange={(e) => setLeadNotes(e.target.value)}
                    placeholder="Add notes about this lead..."
                    rows={3}
                  />
                </div>
                <Button size="sm" variant="outline" onClick={handleSaveNotes} disabled={savingNotes}>
                  <Save className="h-3.5 w-3.5 mr-1" />
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </Button>
              </div>

              {/* Activity Timeline */}
              {selectedLead.activities && selectedLead.activities.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Activity Timeline</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedLead.activities.map((activity) => (
                      <div key={activity.id} className="flex gap-3 text-sm">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                          <MessageSquare className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs font-medium capitalize">{activity.type}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Select
                  value={selectedLead.status}
                  onValueChange={(val) => {
                    setNewStatus(val);
                    setEditStatusOpen(true);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.filter(s => s !== 'all').map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-navy text-navy">
                  <FileText className="h-4 w-4 mr-1.5" />
                  Create Quote
                </Button>
                <Button variant="outline" className="border-navy text-navy">
                  <ClipboardList className="h-4 w-4 mr-1.5" />
                  Create Project
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={editStatusOpen} onOpenChange={setEditStatusOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
            <DialogDescription>
              Update status for {selectedLead?.firstName} {selectedLead?.lastName}
            </DialogDescription>
          </DialogHeader>
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.filter(s => s !== 'all').map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStatusOpen(false)}>Cancel</Button>
            <Button className="bg-navy hover:bg-navy-light" onClick={handleStatusChange}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedLead?.firstName} {selectedLead?.lastName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
