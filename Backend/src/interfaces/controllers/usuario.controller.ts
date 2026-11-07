// Archivo NUEVO — issue #20
import { Request, Response } from "express";
import { registrarUsuarioCasoDeUso } from "../../application/use-cases/registrarUsuario.js";
import { activarCuentaCasoDeUso } from "../../application/use-cases/activarCuenta.js";
import { reenviarCodigoCasoDeUso } from "../../application/use-cases/reenviarCodigo.js";
import { verificarCuentaGoogleCasoDeUso } from "../../application/use-cases/verificarCuentaGoogle.js";
import { registrarConGoogleCasoDeUso } from "../../application/use-cases/registrarConGoogle.js";

// POST /registro
export const registrarUsuarioController = async (req: Request, res: Response) => {
  try {
    const { email, password, nombre, apellido, fecha_nacimiento, celular, acepta_terminos } = req.body;

    const resultado = await registrarUsuarioCasoDeUso({
      email, password, nombre, apellido, fecha_nacimiento, celular, acepta_terminos
    });

    res.status(201).json({
      mensaje: "Registro exitoso. Revisá tu correo para confirmar tu cuenta.",
      usuario: {
        id_usuario: resultado.usuario.id_usuario,
        email: resultado.usuario.email,
        estado_cuenta: resultado.usuario.estado_cuenta
      }
    });
  } catch (error: any) {
    console.error(error);

    if (error.message === "Ya existe una cuenta registrada con ese email") {
      res.status(409).json({ message: error.message });
      return;
    }

     if (
      error.message === "El email es obligatorio" ||
      error.message === "La contraseña es obligatoria" ||
      error.message === "La contraseña debe tener al menos 8 caracteres, con al menos una mayúscula, una minúscula y un número" ||
      error.message === "El nombre es obligatorio" ||
      error.message === "El apellido es obligatorio" ||
      error.message === "La fecha de nacimiento es obligatoria" ||
      error.message === "El celular es obligatorio" ||
      error.message === "El celular debe empezar con + y el código de país, seguido del número (entre 8 y 15 dígitos, sin espacios ni guiones)" ||
      error.message === "La fecha de nacimiento no es válida" ||
      error.message === "La fecha de nacimiento no puede ser una fecha futura" ||
      error.message === "Tenés que ser mayor de 18 años para registrarte" ||
      error.message === "Tenés que aceptar los Términos y Condiciones y la Política de Privacidad"
    ) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

// POST /verificar-cuenta  { email, codigo }
export const activarCuentaController = async (req: Request, res: Response) => {
  try {
    const { email, codigo } = req.body;

    if (!email || typeof email !== "string") {
      res.status(400).json({ message: "Falta el email" });
      return;
    }
    if (!codigo || typeof codigo !== "string") {
      res.status(400).json({ message: "Falta el código" });
      return;
    }

    const usuario = await activarCuentaCasoDeUso(email, codigo);

    res.status(200).json({
      mensaje: "Cuenta verificada correctamente. Ya podés iniciar sesión.",
      estado_cuenta: usuario.estado_cuenta
    });
  } catch (error: any) {
    console.error(error);

    if (error.message === "No existe una cuenta registrada con ese email") {
      res.status(404).json({ message: error.message });
      return;
    }

    if (
      error.message === "No hay ningún código pendiente para esta cuenta" ||
      error.message === "El código expiró, tenés que pedir uno nuevo" ||
      error.message === "El código ingresado es incorrecto" ||
      error.message === "Superaste el máximo de intentos, tenés que pedir un código nuevo"
    ) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Error al verificar la cuenta" });
  }
};

// POST /reenviar-codigo  { email }
export const reenviarCodigoController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      res.status(400).json({ message: "Falta el email" });
      return;
    }

    await reenviarCodigoCasoDeUso(email);

    res.status(200).json({ mensaje: "Te enviamos un nuevo código a tu correo." });
  } catch (error: any) {
    console.error(error);

    if (error.message === "No existe una cuenta registrada con ese email") {
      res.status(404).json({ message: error.message });
      return;
    }

    if (error.message === "Esta cuenta ya está verificada") {
      res.status(409).json({ message: error.message });
      return;
    }

    if (typeof error.message === "string" && error.message.startsWith("Esperá ")) {
      res.status(429).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Error al reenviar el código" });
  }
};

// POST /registro/google/verificar  { idToken }
// Paso 1 del registro con Google: verifica el token y avisa si la cuenta
// ya existe. Si es cuenta nueva, devuelve el perfil de Google (email,
// nombre, apellido, googleId) para que el frontend complete lo que falta.
export const verificarCuentaGoogleController = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    const perfil = await verificarCuentaGoogleCasoDeUso(idToken);

    res.status(200).json({ perfil });
  } catch (error: any) {
    console.error(error);

    if (error.message === "Ya existe una cuenta registrada con ese email. Iniciá sesión en su lugar.") {
      res.status(409).json({ message: error.message });
      return;
    }

    if (
      error.message === "Falta el token de Google" ||
      error.message === "El token de Google no es válido o expiró" ||
      error.message === "El token de Google no corresponde a esta aplicación" ||
      error.message === "Tu cuenta de Google no tiene el email verificado"
    ) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Error al verificar la cuenta de Google" });
  }
};

// POST /registro/google  { googleId, email, nombre, apellido, fecha_nacimiento, celular }
// Paso 2: crea la cuenta ya con celular y fecha de nacimiento. Queda activa
// directo (Google ya verificó el email).
export const registrarConGoogleController = async (req: Request, res: Response) => {
  try {
    const { googleId, email, nombre, apellido, fecha_nacimiento, celular, acepta_terminos } = req.body;

    const resultado = await registrarConGoogleCasoDeUso({
      googleId, email, nombre, apellido, fecha_nacimiento, celular, acepta_terminos
    });

    res.status(201).json({
      mensaje: "Cuenta creada correctamente con Google. Ya podés iniciar sesión.",
      usuario: {
        id_usuario: resultado.usuario.id_usuario,
        email: resultado.usuario.email,
        estado_cuenta: resultado.usuario.estado_cuenta
      }
    });
  } catch (error: any) {
    console.error(error);

    if (error.message === "Ya existe una cuenta registrada con ese email") {
      res.status(409).json({ message: error.message });
      return;
    }

    if (
      error.message === "Falta la información de Google" ||
      error.message === "El nombre es obligatorio" ||
      error.message === "El apellido es obligatorio" ||
      error.message === "La fecha de nacimiento es obligatoria" ||
      error.message === "El celular es obligatorio" ||
      error.message === "La fecha de nacimiento no es válida" ||
      error.message === "La fecha de nacimiento no puede ser una fecha futura" ||
      error.message === "Tenés que ser mayor de 18 años para registrarte" ||
      error.message === "El celular debe empezar con + y el código de país, seguido del número (entre 8 y 15 dígitos, sin espacios ni guiones)" ||
      error.message === "Tenés que aceptar los Términos y Condiciones y la Política de Privacidad"
    ) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Error al crear la cuenta con Google" });
  }
};