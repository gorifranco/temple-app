export interface SalaType {
  ID: number;
  Nom: string;
  Admin: UsuariType
  CodiSala: string
  Usuaris: UsuariType[]|null
}

export interface UsuariType {
  ID: number;
  Nom: string;
  Email: string;
  TipusUsuari: string;
}

export interface ExerciciType {
  ID: number;
  Nom: string;
}

export interface RutinaType {
  ID: number;
  Nom: string;
  Descripcio: string;
  Exercicis: ExerciciType[]
}

export interface SalesState {
  [id: number]: SalaType;
}