//  Rennvio de código de verificación por email

import {
  buscarUltimoTokenPorUsuario,
  invalidarToken,
  crearToken
} from "../../infrastructure/repositories/tokenVerificacion.repository.js";
import { buscarUsuarioPorEmail } from "../../infrastructure/repositories/usuario.repository.js";
import { generarCodigoVerificacion, calcularVencimientoToken } from "../../infrastructure/security/token.util.js";
import { enviarCorreoVerificacion } from "../../infrastructure/email/correoVerificacion.service.js";

// Tiempo minimo entre reenvio 59 segundos
const COOLDOWN_REENVIO_SEGUNDOS = 60;

export const reenviarCodigoCasoDeUso = async (email: string): Promise<void> => {
  const usuario = await buscarUsuarioPorEmail(email);
  if (!usuario) {
    throw new Error("No existe una cuenta registrada con ese email");
  }

  if (usuario.estado_cuenta === "activo") {
    throw new Error("Esta cuenta ya está verificada");
  }

  const ultimoToken = await buscarUltimoTokenPorUsuario(usuario.id_usuario);

  if (ultimoToken) {
    const segundosDesdeUltimoEnvio =
      (Date.now() - new Date(ultimoToken.creado_en).getTime()) / 1000;

    if (segundosDesdeUltimoEnvio < COOLDOWN_REENVIO_SEGUNDOS) {
      const restante = Math.ceil(COOLDOWN_REENVIO_SEGUNDOS - segundosDesdeUltimoEnvio);
      throw new Error(`Esperá ${restante} segundos antes de pedir un código nuevo`);
    }

    // Invalida el código anterior si todavía estaba activo
    if (ultimoToken.estado_token === "activo") {
      await invalidarToken(ultimoToken.id_token);
    }
  }

  const nuevoCodigo = generarCodigoVerificacion();
  const nuevaExpiracion = calcularVencimientoToken();
  await crearToken(usuario.id_usuario, nuevoCodigo, nuevaExpiracion);

  await enviarCorreoVerificacion(usuario.email, nuevoCodigo);
};