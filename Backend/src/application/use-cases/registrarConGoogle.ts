//(Registrarse) por canal Google SSO

import { crearUsuario, buscarUsuarioPorEmail } from "../../infrastructure/repositories/usuario.repository.js";
import { crearClienteGoogle, buscarClientePorGoogleId } from "../../infrastructure/repositories/cliente.repository.js";
import { registrarEventoAuditoria } from "../../infrastructure/repositories/logAuditoria.repository.js";
import { validarCelular, validarFechaNacimiento } from "../../infrastructure/validation/registroValidaciones.util.js";

import { registrarAceptacionTerminos } from "../../infrastructure/repositories/aceptacionTerminos.repository.js";

interface DatosRegistroGoogle {
  googleId: string;
  email: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  celular: string;
  acepta_terminos?: boolean;
}

export const registrarConGoogleCasoDeUso = async (datos: DatosRegistroGoogle) => {
  const { googleId, email, nombre, apellido, fecha_nacimiento, celular, acepta_terminos } = datos;

  if (!googleId || !email) {
    throw new Error("Falta la información de Google");
  }
  if (!nombre || !nombre.trim()) {
    throw new Error("El nombre es obligatorio");
  }
  if (!apellido || !apellido.trim()) {
    throw new Error("El apellido es obligatorio");
  }
  if (!fecha_nacimiento || !fecha_nacimiento.trim()) {
    throw new Error("La fecha de nacimiento es obligatoria");
  }
  const validacionFecha = validarFechaNacimiento(fecha_nacimiento);
  if (!validacionFecha.valida) {
    throw new Error(validacionFecha.motivo);
  }
  if (!celular || !celular.trim()) {
    throw new Error("El celular es obligatorio");
  }
  if (!validarCelular(celular)) {
    throw new Error("El celular debe empezar con + y el código de país, seguido del número (entre 8 y 15 dígitos, sin espacios ni guiones)");
  }

  if (acepta_terminos !== true) {
    throw new Error("Tenés que aceptar los Términos y Condiciones y la Política de Privacidad");
  }

  const usuarioExistente = await buscarUsuarioPorEmail(email);
  if (usuarioExistente) {
    throw new Error("Ya existe una cuenta registrada con ese email");
  }
  const clienteExistente = await buscarClientePorGoogleId(googleId);
  if (clienteExistente) {
    throw new Error("Ya existe una cuenta registrada con ese email");
  }

  const usuario = await crearUsuario(email, null, "activo");
  if (!usuario) {
    throw new Error("No se pudo crear el usuario");
  }

  const cliente = await crearClienteGoogle(
    usuario.id_usuario,
    nombre,
    apellido,
    fecha_nacimiento,
    celular,
    googleId
  );
  if (!cliente) {
    throw new Error("No se pudo crear el perfil de cliente");
  }

  await registrarAceptacionTerminos(usuario.id_usuario);

  await registrarEventoAuditoria(cliente.id_cliente, "registro_usuario_google");

  return { usuario, cliente };
};
