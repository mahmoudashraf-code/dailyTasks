import { Task } from './../entities/task';
import { AppDataSource } from '../database/dataSource';
import { Between } from 'typeorm';
import { endOfDay, startOfDay } from 'date-fns';

export class TaskService {
  private taskRepository = AppDataSource.getRepository(Task);

  // Get all tasks for a specific user
  async getAllTasksForUser(
    userId: number,
    date: string,
  ): Promise<{ tasks: Task[]; totalHours: number; remainingHours: number }> {
    let res = await this.taskRepository.find({
      where: {
        user: { id: userId },
        startTime: Between(startOfDay(date), endOfDay(date)),
      },
      order: {
        startTime: 'ASC',
      },
    });
    let totalHours = res.reduce((total, task) => {
      const start: any = new Date(task.startTime);
      const end: any = new Date(task.endTime);
      return total + (end - start) / (1000 * 60 * 60);
    }, 0);

    return {
      tasks: res,
      totalHours: totalHours,
      remainingHours: 8 - totalHours,
    };
  }

  // Get a task by ID
  async getTaskById(id: number): Promise<Task | null> {
    return await this.taskRepository.findOneBy({ id });
  }

  // Create a new task
  async createTask(task: Task): Promise<Task> {
    return await this.taskRepository.save(task);
  }

  // Update a task
  async updateTask(id: number, updatedData: Partial<Task>): Promise<void> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new Error('Task not found');
    }
    Object.assign(task, updatedData);
    await task.validateTask(); // Validate updated task
    await this.taskRepository.save(task);
  }

  // Delete a task
  async deleteTask(id: number): Promise<void> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new Error('Task not found');
    }
    await this.taskRepository.remove(task);
  }

  async validateTask(userId: number, date: string, newTask: Task) {
    let res = await this.getAllTasksForUser(userId, date);

    const start: any = new Date(newTask.startTime);
    const end: any = new Date(newTask.endTime);
    const taskDuration = (end - start) / (1000 * 60 * 60);

    if (res.totalHours + taskDuration > 8) {
      throw new Error('Task duration cannot exceed 8 hours.');
    }
  }
}
