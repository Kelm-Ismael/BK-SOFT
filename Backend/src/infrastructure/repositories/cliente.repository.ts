import { pool } from "../../config/db.js";
import { Cliente } from "../../domain/entities/cliente.entity.js";

// Registro de un cliente 

export const crearCliente = async (
  id_usuario: number,
  nombre: string,
  apellido: string,
  fecha_nacimiento: string | null,
  celular: string | null
) => {
  const result = await pool.query<Cliente>(
    `
    INSERT INTO clientes (id_cliente, nombre, apellido, fecha_nacimiento, celular)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [id_usuario, nombre, apellido, fecha_nacimiento, celular]
  );

  return result.rows[0];
};

// registro por canal Google SSO

export const crearClienteGoogle = async (
  id_usuario: number,
  nombre: string,
  apellido: string,
  fecha_nacimiento: string,
  celular: string,
  id_google_sso: string
) => {
  const result = await pool.query<Cliente>(
    `
    INSERT INTO clientes (id_cliente, nombre, apellido, fecha_nacimiento, celular, id_google_sso)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [id_usuario, nombre, apellido, fecha_nacimiento, celular, id_google_sso]
  );

  return result.rows[0];
};

// para que no haya dos clientes con el mismo id_google_sso 

export const buscarClientePorGoogleId = async (id_google_sso: string) => {
  const result = await pool.query<Cliente>(
    `SELECT * FROM clientes WHERE id_google_sso = $1`,
    [id_google_sso]
  );

  return result.rows[0];
};