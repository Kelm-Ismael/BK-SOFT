// src/server.ts — punto de entrada del backend.

import { app } from './app.js';
import { conexion_db } from '../src/config/db.js';
import { PORT } from '../src/config/env.js';


app.listen(PORT, async () => {

  await conexion_db();
  console.log(`\x1b[32m🟢 Servidor corriendo en puerto ${PORT}\x1b[0m`);
});

// Ctrl+C en terminal: apaga el server.
process.on('SIGINT', () => {
  console.log('\n🛑 Servidor detenido');
  process.exit(0);
});

// server apagado.
process.on('SIGTERM', () => {
  console.log('🛑 Servidor terminado (SIGTERM)');
  process.exit(0);
});