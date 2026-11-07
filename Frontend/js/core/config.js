// Módulo de registro y autenticación (issues #19-22)
export const API_REGISTRO = "http://localhost:3000/registro";
export const API_VERIFICAR_CUENTA = "http://localhost:3000/verificar-cuenta";
export const API_REENVIAR_CODIGO = "http://localhost:3000/reenviar-codigo";

// Registro con Google SSO (por ahora solo cuentas nuevas — ver
// claude/estado-backend-db.md para el alcance acordado)
export const API_REGISTRO_GOOGLE_VERIFICAR = "http://localhost:3000/registro/google/verificar";
export const API_REGISTRO_GOOGLE = "http://localhost:3000/registro/google";

// Client ID de OAuth 2.0 (Google Cloud Console > APIs & Services >
// Credentials). Tiene que ser el MISMO valor que GOOGLE_CLIENT_ID en
// Backend/.env.
export const GOOGLE_CLIENT_ID = "562581695923-mhrne6rbf3bkja43rks7a61qv5jp7985.apps.googleusercontent.com";
