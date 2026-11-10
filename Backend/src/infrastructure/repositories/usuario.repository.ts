import { pool } from "../../config/db.js";
import { Usuario } from "../../domain/entities/usuario.entity.js";

// Función  para crear un usuario
export const crearUsuario = async (
  email: string,
  passwordHash: string | null,
  estadoCuenta: string
) => {
  const result = await pool.query<Usuario>(
    `
    INSERT INTO usuarios (email, password_hash, estado_cuenta)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [email, passwordHash, estadoCuenta]
  );

  return result.rows[0];
};

// Busca un usuario por email (Que NO est repetido)
export const buscarUsuarioPorEmail = async (email: string) => {
  const result = await pool.query<Usuario>(
    `SELECT * FROM usuarios WHERE email = $1`,
    [email]
  );

  return result.rows[0];
};

// Activa la cuenta (pendiente -> activo) cuando el código de verificación es correcto
export const activarUsuario = async (id_usuario: number) => {
  const result = await pool.query<Usuario>(
    `
    UPDATE usuarios
    SET estado_cuenta = 'activo'
    WHERE id_usuario = $1
    RETURNING *
    `,
    [id_usuario]
  );

  return result.rows[0];
};