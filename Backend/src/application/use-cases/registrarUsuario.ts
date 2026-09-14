import { crearUsuario, buscarUsuarioPorEmail } from "../../infrastructure/repositories/usuario.repository.js";
import { crearClienteDesdeRegistro } from "../../infrastructure/repositories/cliente.repository.js";
import { crearToken } from "../../infrastructure/repositories/tokenVerificacion.repository.js";
import { registrarEvento } from "../../infrastructure/repositories/logAuditoria.repository.js";
import { hashPassword } from "../../infrastructure/security/password.util.js";
import { generarTokenAleatorio, calcularExpiracion24h } from "../../infrastructure/security/token.util.js";

interface DatosRegistro {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento?: string;
  celular?: string;
}

export const registrarUsuarioCasoDeUso = async (datos: DatosRegistro) => {
  const { email, password, nombre, apellido, fecha_nacimiento, celular } = datos;

  if (!email || !email.trim()) {
    throw new Error("El email es obligatorio");
  }
  if (!password || password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }
  if (!nombre || !nombre.trim()) {
    throw new Error("El nombre es obligatorio");
  }
  if (!apellido || !apellido.trim()) {
    throw new Error("El apellido es obligatorio");
  }

  const usuarioExistente = await buscarUsuarioPorEmail(email);
  if (usuarioExistente) {
    throw new Error("Ya existe una cuenta registrada con ese email");
  }

  const passwordHash = await hashPassword(password);

  const usuario = await crearUsuario(email, passwordHash, "pendiente");
  if (!usuario) {
    throw new Error("No se pudo crear el usuario");
  }

  const cliente = await crearClienteDesdeRegistro(
    usuario.id_usuario,
    nombre,
    apellido,
    fecha_nacimiento ?? null,
    celular ?? null
  );
  if (!cliente) {
    throw new Error("No se pudo crear el perfil de cliente");
  }

  const tokenValidacion = generarTokenAleatorio();
  const tokenExpira = calcularExpiracion24h();
  const token = await crearToken(usuario.id_usuario, tokenValidacion, tokenExpira);

  // TODO (issue #21): acá va el envío real del email con el link de verificación.
  console.log(`[registro] Link de verificación para ${email}: /verificar-cuenta/${tokenValidacion}`);

  await registrarEvento(cliente.id_cliente, "registro_usuario");

  return { usuario, cliente, token };
};