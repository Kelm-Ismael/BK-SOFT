// Rutas
import { Router } from "express";
import {
  registrarUsuarioController,
  activarCuentaController,
  reenviarCodigoController,
  verificarCuentaGoogleController,
  registrarConGoogleController
} from "../controllers/usuario.controller.js";

const router = Router();

router.post("/registro", registrarUsuarioController);
router.post("/verificar-cuenta", activarCuentaController);
router.post("/reenviar-codigo", reenviarCodigoController);
router.post("/registro/google/verificar", verificarCuentaGoogleController);
router.post("/registro/google", registrarConGoogleController);

export default router;
