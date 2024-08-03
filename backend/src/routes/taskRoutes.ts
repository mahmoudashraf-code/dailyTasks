import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { authenticateToken } from './../middleware/auth.middleware';

const router = Router(); // Create a new router instance
const taskController = new TaskController(); // Instantiate the TaskController

// Protect all task routes with the authentication middleware
router.use(authenticateToken);

// Route to get all tasks for a specific user
router.get('/', taskController.getAllTasks); // Get all tasks for a user

// Route to get a task by ID
router.get('/:id', taskController.getTaskById); // Get a specific task by its ID

// Route to create a new task
router.post('/', taskController.createTask); // Create a new task

// Route to update an existing task
router.put('/:id', taskController.updateTask); // Update a task by its ID

// Route to delete a task
router.delete('/:id', taskController.deleteTask); // Delete a task by its ID

export default router; // Export the router
