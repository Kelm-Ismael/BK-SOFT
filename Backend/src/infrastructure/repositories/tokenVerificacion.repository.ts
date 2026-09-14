import { pool } from "../../config/db.js";
import { TokenVerificacion } from "../../domain/entities/tokenVerificacion.entity.js";

export const crearToken = async (
  usuario_id: number,
  tokenValidacion: string,
  tokenExpira: Date
) => {
  const result = await pool.query<TokenVerificacion>(
    `
    INSERT INTO tokens_verificacion (usuario_id, token_validacion, token_expira)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [usuario_id, tokenValidacion, tokenExpira]
  );

  return result.rows[0];
};

export const buscarTokenPorValor = async (tokenValidacion: string) => {
  const result = await pool.query<TokenVerificacion>(
    `SELECT * FROM tokens_verificacion WHERE token_validacion = $1`,
    [tokenValidacion]
  );

  return result.rows[0];
};

export const marcarTokenUtilizado = async (id_token: number) => {
  const result = await pool.query<TokenVerificacion>(
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

export const marcarTokenExpirado = async (id_token: number) => {
  const result = await pool.query<TokenVerificacion>(
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