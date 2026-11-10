// Tipo de la entidad Usuario 
export interface Usuario {
  id_usuario: number;
  email: string;
  password_hash: string | null;
  fecha_registro: Date;
  estado_cuenta: "pendiente" | "activo" | "bloqueado";
}