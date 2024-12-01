export interface SalaType {
  id: number;
  nom: string;
  admin: UsuariType
  codiSala: string
  usuaris: UsuariType[]|null
}

export interface TokenType{
  token: string;
}

export interface UsuariType {
  id: number;
  nom: string;
  email: string|null;
  tipusUsuari: string;
  codiEntrenador: string|null;
}

export interface ExerciciType {
  id: number;
  nom: string;
}

export interface RutinaType {
  id: number;
  nom: string;
  descripcio: string;
  exercicis: ExerciciRutinaType[]
  diesDuracio: number
  cicles: number
}


export interface AlumneType {
  id: number;
  nom: string;
  resultatsRutinaActual: ResultatsExercici[];
  rutinaActual: number|null;
  diaRutrinaActual: number;
}

export interface ReservaType {
  id: number;
  hora: string;
  usuariID: number;
  confirmada: boolean;
}

export interface ExerciciRutinaType {
  id: number;
  nom: string;
  rutinaID: number;
  exerciciID: number;
  ordre: number;
  numSeries: number;
  numRepes: number;
  cicle: number;
  percentatgeRM: number;
  diaRutina: number;
}

export interface ExerciciErrorType {
  exerciciID: string;
  percentatgeRM: string;
  numRepes: string;
  numSeries: string;
}

export interface ConfigType {
  duracioSessions: number;
  maxAlumnesPerSessio: number;
  horaris: HorariType[];
}

export interface ReducedConfigType {
  duracioSessions: number
  maxAlumnesPerSessio: number;
}

export interface HorariType {
  diaSetmana: number;
  desde: string;
  fins: string;
}

export interface ResultatsExercici {
  exerciciRutinaID: number;
  repeticions: number;
  series: number;
  pes: number;
}

export interface RmType {
  exerciciID: number;
  usuariID: number;
  pes: number;
}

export enum status {
  idle = "idle",
  pending = "pending",
  succeeded = "succeeded",
  failed = "failed",
}
export enum actions {
  index = "index",
  create = "create",
  delete = "delete",
  assign = "assign",
  acabar = "acabar",
  createAsStudent = "createAsStudent",
  getPerMonth = "getPerMonth",
  finish = "finish",
  update = "update",
}