// Creacion de los 6 digitos del token

import { randomInt } from "crypto";

export const generarCodigoVerificacion = (): string => {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
};

// Fecha de expiración: 24 horas desde ahora 
export const calcularVencimientoToken = (): Date => {
  const ahora = new Date();
  return new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
};