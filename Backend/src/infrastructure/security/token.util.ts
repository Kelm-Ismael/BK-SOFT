import { randomBytes } from "crypto";

// Token aleatorio de 64 caracteres hex (encaja con token_validacion VARCHAR(64))
export const generarTokenAleatorio = (): string => {
  return randomBytes(32).toString("hex");
};

// Fecha de expiración: 24 horas desde ahora (Escenario 3)
export const calcularExpiracion24h = (): Date => {
  const ahora = new Date();
  return new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
};