import { AppDataSource } from '../database/dataSource'; // Import the data source configuration
import { User } from '../entities/user'; // Import the User entity

export class UserService {
  // Initialize the user repository using the data source
  private userRepository = AppDataSource.getRepository(User);

  async getUserByEmailAndPaasword(email: string, password: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email, password }); // Find and return the user by email
  }

  // Retrieve a user by their ID
  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id }); // Find and return the user by ID
  }

  // Create a new user in the database
  async createUser(user: User): Promise<User> {
    return this.userRepository.save(user); // Save the new user and return it
  }

  // Update an existing user's information
  async updateUser(id: number, user: Partial<User>): Promise<void> {
    await this.userRepository.update(id, user); // Update the user with the provided data
  }

  // Delete a user from the database
  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id); // Remove the user from the database
  }
}
