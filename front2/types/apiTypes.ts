export interface SalaType {
  ID: number;
  Nom: string;
  Admin: UsuariType
  CodiSala: string
  Usuaris: UsuariType[]|null
}

export interface TokenType{
  token: string;
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
  Exercicis: ExerciciRutinaType[]
  DiesDuracio: number
  Cicles: number
}


export interface AlumneType {
  ID: number;
  Nom: string;
  ResultatsRutinaActual: ResultatsExercici[];
  Reserves: ReservaType[];
  RutinaActual: number|null;
}

export interface ReservaType {
  ID: number;
  Hora: string;
  UsuariID: number;
  Confirmada: boolean;
}

export interface ExerciciRutinaType {
  ID: number|null;
  Nom: string;
  RutinaID: number|null;
  ExerciciID: number;
  Ordre: number;
  NumSeries: number;
  NumRepes: number;
  Cicle: number;
  PercentatgeRM: number;
  DiaRutina: number;
}

export interface ExerciciErrorType {
  ExerciciID: string;
  PercentatgeRM: string;
  NumRepes: string;
  NumSeries: string;
}

export interface ConfigType {
  DuracioSessions: number;
  MaxAlumnesPerSessio: number;
  Horaris: HorariType[];
}

export interface HorariType {
  DiaSetmana: number;
  Desde: string;
  Fins: string;
}

export interface ResultatsExercici {
  ExerciciRutinaID: number;
  Repeticions: number;
  Series: number;
  Pes: number;
}

export interface RMDetail {
  Pes: number;
}