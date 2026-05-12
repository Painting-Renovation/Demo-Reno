'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  GripVertical,
  Clock,
  AlertTriangle,
  ArrowRight,
  CircleDot,
  CheckCircle2,
  Trash2,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type Priority = 'high' | 'medium' | 'low';
type ColumnId = 'todo' | 'inProgress' | 'done';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  leadName: string;
  column: ColumnId;
}

interface Column {
  id: ColumnId;
  title: string;
  icon: React.ElementType;
  color: string;
  bgLight: string;
}

const columns: Column[] = [
  { id: 'todo', title: 'To Do', icon: CircleDot, color: 'text-blue-600', bgLight: 'bg-blue-50' },
  { id: 'inProgress', title: 'In Progress', icon: Clock, color: 'text-gold', bgLight: 'bg-gold/10' },
  { id: 'done', title: 'Done', icon: CheckCircle2, color: 'text-sage', bgLight: 'bg-sage/10' },
];

const priorityConfig: Record<Priority, { label: string; color: string; bg: string; border: string }> = {
  high: { label: 'High', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-400' },
  medium: { label: 'Medium', color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-400' },
  low: { label: 'Low', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-400' },
};

const sampleLeads = [
  'John Smith',
  'Sarah Johnson',
  'Mike Chen',
  'Emily Davis',
  'Robert Wilson',
  'Lisa Anderson',
  'David Brown',
  'Jennifer Taylor',
];

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Follow up with John S.',
    description: 'Discuss estimate for living room repaint',
    priority: 'high',
    dueDate: '2025-07-20',
    leadName: 'John Smith',
    column: 'todo',
  },
  {
    id: 'task-2',
    title: 'Order paint for Smith project',
    description: 'Benjamin Moore Cloud White - 8 gallons',
    priority: 'high',
    dueDate: '2025-07-18',
    leadName: 'Sarah Johnson',
    column: 'todo',
  },
  {
    id: 'task-3',
    title: 'Prepare quote for deck staining',
    description: 'Measure deck area and prepare itemized quote',
    priority: 'medium',
    dueDate: '2025-07-22',
    leadName: 'Mike Chen',
    column: 'todo',
  },
  {
    id: 'task-4',
    title: 'Schedule cabinet refinishing walkthrough',
    description: 'Visit client kitchen to assess cabinet condition',
    priority: 'medium',
    dueDate: '2025-07-19',
    leadName: 'Emily Davis',
    column: 'inProgress',
  },
  {
    id: 'task-5',
    title: 'Send contract to Robert Wilson',
    description: 'Exterior painting contract for full house',
    priority: 'high',
    dueDate: '2025-07-17',
    leadName: 'Robert Wilson',
    column: 'inProgress',
  },
  {
    id: 'task-6',
    title: 'Pick up drop cloths and supplies',
    description: 'Home Depot run for painters tape, cloths, trays',
    priority: 'low',
    dueDate: '2025-07-21',
    leadName: 'David Brown',
    column: 'inProgress',
  },
  {
    id: 'task-7',
    title: 'Complete Anderson living room',
    description: 'Second coat and touch-ups, cleanup',
    priority: 'medium',
    dueDate: '2025-07-15',
    leadName: 'Lisa Anderson',
    column: 'done',
  },
  {
    id: 'task-8',
    title: 'Email photos to Jennifer T.',
    description: 'Before/after photos from Taylor project',
    priority: 'low',
    dueDate: '2025-07-14',
    leadName: 'Jennifer Taylor',
    column: 'done',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' },
  }),
  exit: { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.2 } },
};

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPriority, setFormPriority] = useState<Priority>('medium');
  const [formDueDate, setFormDueDate] = useState('');
  const [formLead, setFormLead] = useState('');

  const handleAddTask = useCallback(() => {
    if (!formTitle.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: formTitle.trim(),
      description: formDescription.trim(),
      priority: formPriority,
      dueDate: formDueDate || new Date().toISOString().split('T')[0],
      leadName: formLead || 'Unassigned',
      column: 'todo',
    };
    setTasks((prev) => [...prev, newTask]);
    setFormTitle('');
    setFormDescription('');
    setFormPriority('medium');
    setFormDueDate('');
    setFormLead('');
    setDialogOpen(false);
  }, [formTitle, formDescription, formPriority, formDueDate, formLead]);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: ColumnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, columnId: ColumnId) => {
      e.preventDefault();
      setDragOverColumn(null);
      const taskId = e.dataTransfer.getData('text/plain');
      if (taskId) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, column: columnId } : t))
        );
      }
      setDraggedTask(null);
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
    setDragOverColumn(null);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateStr: string, column: ColumnId) => {
    if (column === 'done') return false;
    const due = new Date(dateStr + 'T23:59:59');
    return due < new Date();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-navy">Task Manager</h2>
          <p className="text-sm text-muted-foreground">
            Drag tasks between columns to update status
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold/90 text-white gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New Task</DialogTitle>
              <DialogDescription>
                Create a new task and assign it to a lead.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  placeholder="e.g., Follow up with client"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-desc">Description</Label>
                <Textarea
                  id="task-desc"
                  placeholder="Task details..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={formPriority} onValueChange={(v) => setFormPriority(v as Priority)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-date">Due Date</Label>
                  <Input
                    id="task-date"
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assign to Lead</Label>
                <Select value={formLead} onValueChange={setFormLead}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a lead..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleLeads.map((lead) => (
                      <SelectItem key={lead} value={lead}>
                        {lead}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-gold hover:bg-gold/90 text-white"
                onClick={handleAddTask}
                disabled={!formTitle.trim()}
              >
                Add Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => {
          const columnTasks = tasks.filter((t) => t.column === column.id);
          const ColIcon = column.icon;
          return (
            <div
              key={column.id}
              className={cn(
                'flex flex-col rounded-xl border-2 border-dashed transition-colors duration-200 min-h-[400px]',
                dragOverColumn === column.id
                  ? 'border-gold bg-gold/5'
                  : 'border-transparent bg-muted/40'
              )}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <div className="flex items-center gap-2">
                  <ColIcon className={cn('h-4 w-4', column.color)} />
                  <h3 className="font-semibold text-sm text-navy">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs font-medium">
                    {columnTasks.length}
                  </Badge>
                </div>
                {column.id !== 'done' && columnTasks.length > 0 && (
                  <div className="flex items-center gap-1">
                    {columns
                      .filter((c) => c.id !== column.id)
                      .map((nextCol) => (
                        <Button
                          key={nextCol.id}
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-gold"
                          title={`Move all to ${nextCol.title}`}
                          onClick={() =>
                            setTasks((prev) =>
                              prev.map((t) =>
                                t.column === column.id ? { ...t, column: nextCol.id } : t
                              )
                            )
                          }
                        >
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      ))}
                  </div>
                )}
              </div>

              {/* Task Cards */}
              <div className="flex-1 px-3 pb-3 space-y-2 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {columnTasks.map((task, i) => {
                    const pConfig = priorityConfig[task.priority];
                    return (
                      <motion.div
                        key={task.id}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        layoutId={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, task.id)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          'cursor-grab active:cursor-grabbing rounded-lg border bg-white shadow-sm',
                          'hover:shadow-md transition-shadow duration-200',
                          'border-l-4',
                          pConfig.border,
                          draggedTask === task.id && 'opacity-50 scale-95'
                        )}
                      >
                        <div className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50 mt-0.5" />
                              <span className="text-sm font-medium text-navy leading-snug truncate">
                                {task.title}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task.id);
                              }}
                              className="shrink-0 p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>

                          {task.description && (
                            <p className="text-xs text-muted-foreground pl-5.5 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className={cn('text-[10px] font-semibold px-1.5 py-0', pConfig.bg, pConfig.color)}
                              >
                                {task.priority === 'high' && <AlertTriangle className="h-2.5 w-2.5 mr-1" />}
                                {pConfig.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span
                                className={cn(
                                  'flex items-center gap-1',
                                  isOverdue(task.dueDate, task.column) && 'text-red-500 font-medium'
                                )}
                              >
                                <Clock className="h-3 w-3" />
                                {formatDate(task.dueDate)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 pl-5.5">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-[11px] text-muted-foreground hover:text-gold cursor-pointer transition-colors">
                              {task.leadName}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {columnTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <div className={cn('rounded-full p-2 mb-2', column.bgLight)}>
                      <ColIcon className={cn('h-5 w-5', column.color)} />
                    </div>
                    <p className="text-xs">Drop tasks here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
