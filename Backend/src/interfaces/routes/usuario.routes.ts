import { Router } from "express";
import {
  registrarUsuarioController,
  verificarCuentaController
} from "../controllers/usuario.controller.js";

const router = Router();

router.post("/registro", registrarUsuarioController);
router.get("/verificar-cuenta/:token", verificarCuentaController);

export default router;