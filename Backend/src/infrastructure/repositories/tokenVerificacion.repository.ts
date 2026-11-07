// Archivo NUEVO — issue #20
import { pool } from "../../config/db.js";

// Crea el token de verificación para un usuario recién registrado (24h de validez)
export const crearToken = async (
  usuario_id: number,
  tokenValidacion: string,
  tokenExpira: Date
) => {

  const result = await pool.query(
    `
    INSERT INTO tokens_verificacion (usuario_id, token_validacion, token_expira)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [usuario_id, tokenValidacion, tokenExpira]
  );

  return result.rows[0];
};

// Busca el token activo más reciente de un usuario
export const buscarTokenActivoPorUsuario = async (usuario_id: number) => {

  const result = await pool.query(
    `
    SELECT * FROM tokens_verificacion
    WHERE usuario_id = $1 AND estado_token = 'activo'
    ORDER BY id_token DESC
    LIMIT 1
    `,
    [usuario_id]
  );

  return result.rows[0];
};

// Busca el último token de un usuario sin importar su estado (para el cooldown de "Reenviar")
export const buscarUltimoTokenPorUsuario = async (usuario_id: number) => {

  const result = await pool.query(
    `
    SELECT * FROM tokens_verificacion
    WHERE usuario_id = $1
    ORDER BY id_token DESC
    LIMIT 1
    `,
    [usuario_id]
  );

  return result.rows[0];
};

// Incrementa el contador de intentos fallidos de un token puntual
export const registrarIntentoFallido = async (id_token: number) => {

  const result = await pool.query(
    `
    UPDATE tokens_verificacion
    SET intentos_fallidos = intentos_fallidos + 1
    WHERE id_token = $1
    RETURNING *
    `,
    [id_token]
  );

  return result.rows[0];
};

// Marca un token como utilizado (cuenta ya verificada con este token)
export const marcarTokenUtilizado = async (id_token: number) => {

  const result = await pool.query(
    `
    UPDATE tokens_verificacion
    SET estado_token = 'utilizado'
    WHERE id_token = $1
    RETURNING *
    `,
    [id_token]
  );

  return result.rows[0];
};

// Marca un token como expirado (pasaron las 24h sin que se use, o se pasó de intentos)
export const invalidarToken = async (id_token: number) => {

  const result = await pool.query(
    `
    UPDATE tokens_verificacion
    SET estado_token = 'expirado'
    WHERE id_token = $1
    RETURNING *
    `,
    [id_token]
  );

  return result.rows[0];
};