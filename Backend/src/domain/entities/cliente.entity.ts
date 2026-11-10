// Tipo de la entidad Cliente 
export interface Cliente {
  id_cliente: number; // == id_usuario
  nombre: string;
  apellido: string;
  fecha_nacimiento: string | null;
  celular: string | null;
  id_google_sso: string | null;
}