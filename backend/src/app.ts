import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middleware/app.middlewares';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import profileRoutes from './routes/profileRoutes';
import { join } from 'path';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(express.static('views'));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/profile', profileRoutes);

app.use(middlewares.errorHandler);

app.get('/app/*', (req, res) => {
  res.sendFile(join(process.cwd(), 'views', 'index.html'));
});

app.use(middlewares.notFound);

export default app;
