import { Task } from './../entities/task';
import { User } from './../entities/user';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import 'dotenv/config'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.MySQL_USERNAME, // Access username from .env
  password: process.env.MySQL_PASSWORD, // Access password from .env
  database: process.env.MySQL_DATABASE_NAME, // Access database name from .env
  synchronize: true,
  entities: [User, Task]
});
