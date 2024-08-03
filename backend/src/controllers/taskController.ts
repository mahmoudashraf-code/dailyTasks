import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { Task } from './../entities/task';

export class TaskController {
  private taskService = new TaskService();

  // Get all tasks for a user
  getAllTasks = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.user.id, 10);
    const tasks = await this.taskService.getAllTasksForUser(userId, req.query['day'] as string);
    res.json(tasks);
  };

  // Get a task by ID
  getTaskById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const task = await this.taskService.getTaskById(id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).send('Task not found');
    }
  };

  // Create a new task
  createTask = async (req: Request, res: Response): Promise<void> => {
    const task = new Task();
    task.description = req.body.description;
    task.startTime = new Date(req.body.startTime);
    task.endTime = new Date(req.body.endTime);
    task.user = req.user.id; // Assuming you're sending userId in the request body

    try {
      await task.validateTask();
      await this.taskService.validateTask(req.user.id, req.body.startTime, task);
      const newTask = await this.taskService.createTask(task);
      res.status(201).json(newTask);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Update a task
  updateTask = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const updatedData = req.body as Task;

    try {
      await this.taskService.validateTask(req.user.id, req.body.startTime, updatedData);
      await this.taskService.updateTask(id, updatedData);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Delete a task
  deleteTask = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    await this.taskService.deleteTask(id);
    res.status(204).send();
  };
}
