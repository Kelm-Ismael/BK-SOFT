// Archivo NUEVO — issue #20 (modificado en #21 para el envío real del mail)

import { crearUsuario, buscarUsuarioPorEmail } from "../../infrastructure/repositories/usuario.repository.js";
import { crearCliente } from "../../infrastructure/repositories/cliente.repository.js";
import { crearToken } from "../../infrastructure/repositories/tokenVerificacion.repository.js";
import { registrarEventoAuditoria } from "../../infrastructure/repositories/logAuditoria.repository.js";
import { encriptarPassword } from "../../infrastructure/security/password.util.js";
import { generarCodigoVerificacion, calcularVencimientoToken } from "../../infrastructure/security/token.util.js";

import { enviarCorreoVerificacion } from "../../infrastructure/email/correoVerificacion.service.js"; // envío del mail de verificación
import { validarCelular, validarFechaNacimiento, validarPassword } from "../../infrastructure/validation/registroValidaciones.util.js";

import { registrarAceptacionTerminos } from "../../infrastructure/repositories/aceptacionTerminos.repository.js"; // constancia de aceptación de Términos y Política de Privacidad

interface DatosRegistro {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  celular: string;
  acepta_terminos?: boolean;
}

export const registrarUsuarioCasoDeUso = async (datos: DatosRegistro) => {
  const { email, password, nombre, apellido, fecha_nacimiento, celular, acepta_terminos } = datos;

  // Validaciones simples
  if (!email || !email.trim()) {
    throw new Error("El email es obligatorio");
  }
  if (!password) {
    throw new Error("La contraseña es obligatoria");
  }
  //mínimo 8 caracteres

  if (!validarPassword(password)) {
    throw new Error("La contraseña debe tener al menos 8 caracteres, con al menos una mayúscula, una minúscula y un número");
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

  // casilla de Términos y Política es obligatoria
  if (acepta_terminos !== true) {
    throw new Error("Tenés que aceptar los Términos y Condiciones y la Política de Privacidad");
  }

  const usuarioExistente = await buscarUsuarioPorEmail(email);
  if (usuarioExistente) {
    throw new Error("Ya existe una cuenta registrada con ese email");
  }

  const passwordHash = await encriptarPassword(password);

  // Cuenta "pendiente" hasta que se verifique el token
  const usuario = await crearUsuario(email, passwordHash, "pendiente");
  if (!usuario) {
    throw new Error("No se pudo crear el usuario");
  }

  const cliente = await crearCliente(
    usuario.id_usuario,
    nombre,
    apellido,
    fecha_nacimiento,
    celular
  );
  if (!cliente) {
    throw new Error("No se pudo crear el perfil de cliente");
  }

  await registrarAceptacionTerminos(usuario.id_usuario);

  const tokenValidacion = generarCodigoVerificacion();
  const tokenExpira = calcularVencimientoToken();
  const token = await crearToken(usuario.id_usuario, tokenValidacion, tokenExpira);

  // envío real del email con el link de verificación
  await enviarCorreoVerificacion(email, tokenValidacion);

  await registrarEventoAuditoria(cliente.id_cliente, "registro_usuario");

  return { usuario, cliente, token };
};
