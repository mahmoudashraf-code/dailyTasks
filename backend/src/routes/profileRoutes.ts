import { Router } from 'express'; // Import the Router class from express
import { UserController } from '../controllers/userController'; // Import the UserController
import { authenticateToken } from './../middleware/auth.middleware';

const router = Router(); // Create a new instance of Router
const userController = new UserController(); // Instantiate the UserController

// Protect all profile routes with the authentication middleware
router.use(authenticateToken);

// Route to get a user by ID
router.get('/', userController.getUserById); // Calls getUserById method, passing the user ID as a parameter

// Route to update an existing user
router.put('/', userController.updateUser); // Calls updateUser method, passing the user ID and updated data

// Route to delete a user
router.delete('/', userController.deleteUser); // Calls deleteUser method, passing the user ID to delete the user

export default router; // Export the configured router
