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
  Email: string|null;
  TipusUsuari: string;
  CodiEntrenador: string|null;
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

export interface AlumnesState {
  [id: number]: AlumneType;
}

export interface AlumneType {
  ID: number;
  Nom: string;
  Entrenos: EntrenoType[];
  Reserves: ReservaType[];
}

export interface EntrenoType {
  Dia_hora: Date;
  Usuari: UsuariType;
  Rutina: RutinaType;
  DiaRutina: number;
}

export interface ReservaType {
  ID: number;
  Hora: Date;
  Usuari: UsuariType;
  Entrenador: UsuariType;
  Confirmada: boolean;
}
