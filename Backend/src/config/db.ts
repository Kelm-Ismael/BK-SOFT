

import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function conexion_db(): Promise<void> {
  try {
    const client = await pool.connect();
    console.log('\x1b[32m📦 Base de datos conectada exitosamente\x1b[0m');
    client.release();
  } catch (error) {
    console.error('\x1b[31m❌ Error al conectar a la base de datos:\x1b[0m', error);
    process.exit(1);
  }
}