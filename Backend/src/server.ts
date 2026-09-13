import { app } from './app.js';           // 👈 Debe tener .js al final
import { conexion_db } from '../config/db.js'; // 👈 Debe tener .js al final
import dotenv from 'dotenv';             // Las librerías externas (como dotenv) NO llevan .js

dotenv.config();

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, async () => {
  await conexion_db();
  console.log(`\x1b[32m🟢 Servidor corriendo en puerto ${PORT}\x1b[0m`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Servidor detenido');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Servidor terminado (SIGTERM)');
  process.exit(0);
});