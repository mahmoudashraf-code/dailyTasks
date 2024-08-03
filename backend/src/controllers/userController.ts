import { Request, Response } from 'express';
import { User } from '../entities/user';
import { UserService } from './../services/userService';
import jwt from 'jsonwebtoken';

export class UserController {
  private userService = new UserService();

  getUserById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.user.id, 10);
    const user = await this.userService.getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    // Find user by email
    const user = await this.userService.getUserByEmailAndPaasword(email, password);
    if (!user) {
      res.status(401).send('Invalid email or password');
      return;
    }
    // Create a JWT token with a 3-hour expiration
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '3h' });
    res.json({ token }); // Send the token in the response
  };

  join = async (req: Request, res: Response): Promise<void> => {
    const { email, password, name } = req.body;
    const user = new User();
    user.name = name;
    user.password = password;
    user.email = email;
    const newUser = await this.userService.createUser(user);
    res
      .status(201)
      .json({ token: jwt.sign({ id: newUser.id }, process.env.JWT_SECRET as string, { expiresIn: '3h' }) });
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.user.id, 10);
    const user = req.body;
    await this.userService.updateUser(id, user);
    res.status(204).send();
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.user.id, 10);
    await this.userService.deleteUser(id);
    res.status(204).send();
  };
}
