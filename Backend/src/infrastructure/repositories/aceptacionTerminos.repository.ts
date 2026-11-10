
import { pool } from "../../config/db.js";

export const VERSION_TERMINOS = "1.0";
export const VERSION_POLITICA = "1.0";

export const registrarAceptacionTerminos = async (usuario_id: number) => {
  const result = await pool.query(
    `
    INSERT INTO aceptaciones_terminos (usuario_id, version_terminos, version_politica)
    VALUES ($1, $2, $3)
    ON CONFLICT (usuario_id, version_terminos, version_politica) DO NOTHING
    RETURNING *
    `,
    [usuario_id, VERSION_TERMINOS, VERSION_POLITICA]
  );

  return result.rows[0];
};
