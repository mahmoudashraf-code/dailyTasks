import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-label';
import { useToast } from '@/components/ui/use-toast';

type Task = {
  id: number;
  description: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
};

// Function to calculate total hours
function calculateTotalHours(tasks: Task[]): number {
  return tasks.reduce((total, task) => {
    const start = new Date(task.startTime);
    const end = new Date(task.endTime);
    return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, 0);
}

// Function to calculate task duration in hours
function calculateTaskDuration(task: Task): number {
  const start = new Date(task.startTime);
  const end = new Date(task.endTime);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

// Function to format date-time for display
function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Function to get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

const Tasks: React.FC = () => {
  const { toast } = useToast(); // Initialize toast for notifications
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ description: '', startTime: '', endTime: '' });
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(getTodayDate());
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const fetchTasks = async (day: string) => {
    try {
      const response = await axios.get(`/api/tasks?day=${day}`);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks(selectedDay);
  }, [selectedDay]);

  const totalHours = calculateTotalHours(tasks);
  const remainingHours = 8 - totalHours;

  const handleAddOrUpdateTask = async () => {
    const start = new Date(newTask.startTime);
    const end = new Date(newTask.endTime);

    if (start >= end) {
      toast({
        title: 'Error',
        description: 'End time must be after start time.',
        variant: 'destructive',
      });
      return;
    }

    const taskDuration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (taskDuration > 8) {
      toast({
        title: 'Error',
        description: 'Task duration cannot exceed 8 hours.',
        variant: 'destructive',
      });
      return;
    }

    const taskDay = start.toISOString().split('T')[0];

    if (taskDay === selectedDay) {
      if (totalHours + taskDuration > 8 && editingTaskId === null) {
        toast({
          title: 'Error',
          description: 'Total task duration for the day cannot exceed 8 hours.',
          variant: 'destructive',
        });
        return;
      }
    }

    try {
      if (editingTaskId !== null) {
        // Update task
        await axios.put(`/api/tasks/${editingTaskId}`, {
          ...newTask,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        });
      } else {
        // Add new task
        await axios.post('/api/tasks', { ...newTask, startTime: start.toISOString(), endTime: end.toISOString() });
      }

      setNewTask({ description: '', startTime: '', endTime: '' });
      setEditingTaskId(null);
      setIsDialogOpen(false);
      fetchTasks(selectedDay); // Fetch tasks after add/update
    } catch (error) {
      if (error instanceof Error)
        toast({
          title: 'Error',
          description: 'Error saving task ' + error.message,
          variant: 'destructive',
        });
    }
  };

  const handleEditTask = (task: Task) => {
    setNewTask({
      description: task.description,
      startTime: task.startTime.substring(0, 16),
      endTime: task.endTime.substring(0, 16),
    });
    setEditingTaskId(task.id);
    setIsDialogOpen(true);
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      fetchTasks(selectedDay); // Fetch tasks after delete
    } catch (error) {
      if (error instanceof Error)
        toast({
          title: 'Error',
          description: 'Error deleting task ' + error.message,
          variant: 'destructive',
        });
    }
  };

  const openDeleteConfirm = (id: number) => {
    setTaskToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete !== null) {
      handleDeleteTask(taskToDelete);
    }
    setIsDeleteConfirmOpen(false);
    setTaskToDelete(null);
  };

  return (
    <Card className="mt-3">
      <CardHeader>
        <CardTitle>Daily Tasks</CardTitle>
        <div className="mt-2">
          <Input className='mt-2' type="date" id="dayFilter" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your daily tasks.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Total Hours</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.id}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{formatDateTime(task.startTime)}</TableCell>
                <TableCell>{formatDateTime(task.endTime)}</TableCell>
                <TableCell>{calculateTaskDuration(task).toFixed(2)} hrs</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" onClick={() => handleEditTask(task)}>
                    Edit
                  </Button>
                  <Button variant="outline" onClick={() => openDeleteConfirm(task.id)} className="ml-2">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total Hours</TableCell>
              <TableCell className="text-right">{totalHours.toFixed(2)} hrs</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Remaining Hours</TableCell>
              <TableCell className="text-right">{remainingHours.toFixed(2)} hrs</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="mt-4">
              {editingTaskId !== null ? 'Update Task' : 'Add Task'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{editingTaskId !== null ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={newTask.startTime}
                  onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={newTask.endTime}
                  onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                />
              </div>
              <Button variant="default" onClick={handleAddOrUpdateTask}>
                {editingTaskId !== null ? 'Update Task' : 'Add Task'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent>
            <DialogTitle>Confirm Delete</DialogTitle>
            <p>Are you sure you want to delete this task?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteTask}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default Tasks;
