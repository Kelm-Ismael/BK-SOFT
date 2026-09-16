// Archivo NUEVO — issue #20
import { Request, Response } from "express";
import { registrarUsuarioCasoDeUso } from "../../application/use-cases/registrarUsuario.js";
import { validarTokenCasoDeUso } from "../../application/use-cases/validarToken.js";
import { reenviarCodigoCasoDeUso } from "../../application/use-cases/reenviarCodigo.js";

// POST /registro
export const registrarUsuarioController = async (req: Request, res: Response) => {
  try {
    const { email, password, nombre, apellido, fecha_nacimiento, celular } = req.body;

    const resultado = await registrarUsuarioCasoDeUso({
      email, password, nombre, apellido, fecha_nacimiento, celular
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
      error.message === "La contraseña debe tener al menos 6 caracteres" ||
      error.message === "El nombre es obligatorio" ||
      error.message === "El apellido es obligatorio" ||
      error.message === "La fecha de nacimiento es obligatoria" ||
      error.message === "El celular es obligatorio"
      
    ) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

// POST /verificar-cuenta  { email, codigo }
export const verificarCuentaController = async (req: Request, res: Response) => {
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

    const usuario = await validarTokenCasoDeUso(email, codigo);

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