import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import todosRouter from './routes/todos.routes';

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/api/todos', todosRouter);

  // error handler at end
  app.use(errorHandler);

  return app;
}
