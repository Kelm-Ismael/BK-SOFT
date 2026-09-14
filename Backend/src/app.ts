// src/app.ts
import express, { type Application } from 'express';
import cors from 'cors';
import usuarioRoutes from "./interfaces/routes/usuario.routes.js";

export const app: Application = express();

app.use(cors());

app.use(express.json());
app.use(usuarioRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});


