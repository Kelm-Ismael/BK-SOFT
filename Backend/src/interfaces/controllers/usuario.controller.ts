import { Request, Response } from "express";
import { registrarUsuarioCasoDeUso } from "../../application/use-cases/registrarUsuario.js";
import { validarTokenCasoDeUso } from "../../application/use-cases/validarToken.js";

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
      error.message === "El apellido es obligatorio"
    ) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

// GET /verificar-cuenta/:token
export const verificarCuentaController = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;

    if (!token || typeof token !== "string") {
      res.status(400).json({ message: "Falta el token" });
      return;
    }

    const usuario = await validarTokenCasoDeUso(token);

    res.status(200).json({
      mensaje: "Cuenta verificada correctamente. Ya podés iniciar sesión.",
      estado_cuenta: usuario.estado_cuenta
    });
  } catch (error: any) {
    console.error(error);

    if (error.message === "Token inválido") {
      res.status(404).json({ message: error.message });
      return;
    }

    if (
      error.message === "Este token ya fue utilizado" ||
      error.message === "El token expiró, tenés que registrarte de nuevo"
    ) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Error al verificar la cuenta" });
  }
};