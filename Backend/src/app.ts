import express, { type Application } from 'express';
import cors from 'cors';

export const app: Application = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de prueba (Health Check del backlog)
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

