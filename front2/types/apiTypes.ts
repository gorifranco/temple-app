export interface SalaType {
  ID: number;
  Nom: string;
  Admin: UsuariType
  CodiSala: string
  Usuaris: UsuariType[]|null
}

export interface UsuariType {
  id: number;
  nom: string;
  email: string;
  tipusUsuari: string;
}