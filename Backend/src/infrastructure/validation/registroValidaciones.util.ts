// validaciones de formato para el registro 

const REGEX_CELULAR = /^\+[1-9]\d{7,14}$/;

export const validarCelular = (celular: string): boolean => {
  return REGEX_CELULAR.test(celular.trim());
};

// Edad mínima para registrarse (excepción 4c del CU-01). No hay edad máxima.
export const EDAD_MINIMA = 18;

const calcularEdad = (fechaNacimiento: Date): number => {
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

  const todaviaNoCumplioEsteAnio =
    hoy.getMonth() < fechaNacimiento.getMonth() ||
    (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate());

  if (todaviaNoCumplioEsteAnio) {
    edad--;
  }

  return edad;
};

interface ResultadoValidacionFecha {
  valida: boolean;
  motivo?: string;
}

export const validarFechaNacimiento = (fechaNacimientoStr: string): ResultadoValidacionFecha => {
  const fecha = new Date(fechaNacimientoStr);

  if (Number.isNaN(fecha.getTime())) {
    return { valida: false, motivo: "La fecha de nacimiento no es válida" };
  }

  if (fecha.getTime() > Date.now()) {
    return { valida: false, motivo: "La fecha de nacimiento no puede ser una fecha futura" };
  }

  const edad = calcularEdad(fecha);

  if (edad < EDAD_MINIMA) {
    return { valida: false, motivo: "Tenés que ser mayor de 18 años para registrarte" };
  }

  return { valida: true };
};

// ValidAcion de contraseña

const REGEX_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

export const validarPassword = (password: string): boolean => {
  return REGEX_PASSWORD.test(password);
};