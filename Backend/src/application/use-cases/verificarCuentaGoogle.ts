// Registrarse con google sso

import { buscarUsuarioPorEmail } from "../../infrastructure/repositories/usuario.repository.js";
import { buscarClientePorGoogleId } from "../../infrastructure/repositories/cliente.repository.js";
import { verificarTokenGoogle, type PerfilGoogle } from "../../infrastructure/security/googleToken.util.js";

const MENSAJE_CUENTA_EXISTENTE = "Ya existe una cuenta registrada con ese email. Iniciá sesión en su lugar.";

export const verificarCuentaGoogleCasoDeUso = async (idToken: string): Promise<PerfilGoogle> => {
  const perfil = await verificarTokenGoogle(idToken);

  const usuarioExistente = await buscarUsuarioPorEmail(perfil.email);
  if (usuarioExistente) {
    throw new Error(MENSAJE_CUENTA_EXISTENTE);
  }

  const clienteExistente = await buscarClientePorGoogleId(perfil.googleId);
  if (clienteExistente) {
    throw new Error(MENSAJE_CUENTA_EXISTENTE);
  }

  return perfil;
};
