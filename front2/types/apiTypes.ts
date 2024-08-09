export interface SalaType {
  id: number;
  nom: string;
  admin: UsuariType
  codi: string
}

export interface UsuariType {
  id: number;
  nom: string;
  email: string;
  tipusUsuari: string;
}