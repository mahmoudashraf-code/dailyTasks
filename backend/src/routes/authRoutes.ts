import { Router, Request, Response } from 'express'; // Import the Router class from express
import { UserController } from '../controllers/userController'; // Import the UserController

const router = Router(); // Create a new instance of Router
const userController = new UserController(); // Instantiate the UserController

// Add the login route
router.post('/login', userController.login);


// Add the join route
router.post('/join', userController.join);

export default router; // Export the configured router
