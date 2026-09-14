import {
  buscarTokenPorValor,
  marcarTokenUtilizado,
  marcarTokenExpirado
} from "../../infrastructure/repositories/tokenVerificacion.repository.js";
import { actualizarEstadoCuenta } from "../../infrastructure/repositories/usuario.repository.js";
import { registrarEvento } from "../../infrastructure/repositories/logAuditoria.repository.js";

export const validarTokenCasoDeUso = async (tokenValidacion: string) => {
  const token = await buscarTokenPorValor(tokenValidacion);

  if (!token) {
    throw new Error("Token inválido");
  }

  if (token.estado_token === "utilizado") {
    throw new Error("Este token ya fue utilizado");
  }

  const yaExpiro = new Date(token.token_expira).getTime() < Date.now();

  if (yaExpiro || token.estado_token === "expirado") {
    if (token.estado_token !== "expirado") {
      await marcarTokenExpirado(token.id_token);
    }
    throw new Error("El token expiró, tenés que registrarte de nuevo");
  }

  await marcarTokenUtilizado(token.id_token);
  const usuario = await actualizarEstadoCuenta(token.usuario_id, "activo");
  if (!usuario) {
    throw new Error("Error al actualizar el estado de la cuenta");
  }

  await registrarEvento(token.usuario_id, "cuenta_verificada");

  return usuario;
};