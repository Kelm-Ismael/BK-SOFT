// Archivo NUEVO — issue #20
import { Router } from "express";
import {
  registrarUsuarioController,
  verificarCuentaController,
  reenviarCodigoController
} from "../controllers/usuario.controller.js";

const router = Router();

router.post("/registro", registrarUsuarioController);
router.post("/verificar-cuenta", verificarCuentaController);
router.post("/reenviar-codigo", reenviarCodigoController);

export default router;