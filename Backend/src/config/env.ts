// Carga las variables del archivo .env dentro de process.env
// Tiene que ir antes de leer cualquier process.env.* de este archivo
import 'dotenv/config'

export const PORT = process.env.PORT || 3000

export const DB_URL = process.env.DB_URL || ''
//export const JWT_SECRET = process.env.JWT_SECRET || ''

export const host_db = process.env.host_db || "localhost"; // servidor db
export const usuario_db = process.env.usuario_db || "postgres"; // usuario db
export const contraseña_db = process.env.contraseña_db || "476235";
export const nombre_db = process.env.nombre_db || "bksoft"; //nombre db
export const puerto_db = process.env.puerto_db || "5432"; //puerto de PostgresSQL


