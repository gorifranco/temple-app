import { ExerciciErrorType, ExerciciRutinaType, ReducedConfigType } from "@/types/apiTypes"

export function nomSalaValidator(nom: string) {
  if (!nom || nom.length === 0) return "Nom no pot ser buit."
  if (nom.length < 2) return 'Nom massa curt.'
  if (nom.length > 15) return 'Nom massa llarg.'
  return ''
}

export function descripcioValidator(descripcio: string) {
  if (descripcio.length > 150) return 'Descripcio massa llarga.'
  return ''
}

export function nomRutinaValidator(nom: string) {
  if (!nom || nom.length === 0) return "Nom no pot ser buit."
  if (nom.length < 2) return 'Nom massa curt.'
  if (nom.length > 15) return 'Nom massa llarg.'
  return ''
}

export function exercicisValidator(exercicis: ExerciciRutinaType[]): { error: boolean, errors: Map<number, ExerciciErrorType> } {
  let errorExists = false;
  let errors = new Map<number, ExerciciErrorType>();

  const validate = (condition: boolean, message: string, field: keyof ExerciciErrorType, errorObj: ExerciciErrorType) => {
    if (condition) {
      errorObj[field] = message;
      errorExists = true;
    }
  };

  exercicis.forEach((exercici, index) => {
    const error: ExerciciErrorType = {
      exerciciID: "",
      percentatgeRM: "",
      numRepes: "",
      numSeries: "",
    };

    // Validaciones
    validate(exercici.exerciciID === -1, "Tria un exercici.", "exerciciID", error);
    validate(exercici.percentatgeRM === 0, "Obligatori", 'percentatgeRM', error);
    validate(exercici.percentatgeRM < 0, "Percentatge RM no pot ser negatiu.", 'percentatgeRM', error);
    validate(exercici.percentatgeRM > 100, "Percentatge RM no pot ser major que 100.", 'percentatgeRM', error);
    validate(exercici.percentatgeRM === null, "Percentatge RM no pot ser buit.", 'percentatgeRM', error);
    validate(exercici.numRepes === 0, "Obligatori", 'numRepes', error);
    validate(exercici.numRepes < 0, "NumRepes no pot ser negatiu.", 'numRepes', error);
    validate(exercici.numRepes > 100, "NumRepes no pot ser major que 100.", 'numRepes', error);
    validate(exercici.numRepes === null, "NumRepes no pot ser buit.", 'numRepes', error);
    validate(exercici.numSeries === 0, "Obligatori", 'numSeries', error);
    validate(exercici.numSeries < 0, "NumSeries no pot ser negatiu.", 'numSeries', error);
    validate(exercici.numSeries > 100, "NumSeries no pot ser major que 100.", 'numSeries', error);
    validate(exercici.numSeries === null, "NumSeries no pot ser buit.", 'numSeries', error);

    errors.set(index, error);
  });

  return { error: errorExists, errors: errors };
}


export function ciclesValidator(cicles: Number|null) {
  if(!cicles) return "Cicles no pot estar buit"
  if (cicles = 0) return "Cicles no pot ser 0"
  if (cicles > 100) return "Cicles no pot ser superior a 100."
  return ''
}

export function diesValidator(dies: Number|null) {
  if(!dies) return "Dies no pot estar buit"
  if (dies == 0) return "Dies no pot ser 0"
  if (dies.valueOf() > 100) return "Dies no pot ser superior a 100."
  return ''
}
export function configValidator(config:ReducedConfigType)
{
  if (config.duracioSessions == null) return false;
  if (config.maxAlumnesPerSessio == null) return false;
  return true;
}


