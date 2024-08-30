import { ExerciciErrorType, ExerciciRutinaType } from "@/types/apiTypes"

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
      ExerciciID: "",
      PercentatgeRM: "",
      NumRepes: "",
      NumSeries: "",
    };

    // Validaciones
    validate(exercici.ExerciciID === -1, "Tria un exercici.", "ExerciciID", error);
    validate(exercici.PercentatgeRM === 0, "Obligatori", 'PercentatgeRM', error);
    validate(exercici.PercentatgeRM < 0, "Percentatge RM no pot ser negatiu.", 'PercentatgeRM', error);
    validate(exercici.PercentatgeRM > 100, "Percentatge RM no pot ser major que 100.", 'PercentatgeRM', error);
    validate(exercici.PercentatgeRM === null, "Percentatge RM no pot ser buit.", 'PercentatgeRM', error);
    validate(exercici.NumRepes === 0, "Obligatori", 'NumRepes', error);
    validate(exercici.NumRepes < 0, "NumRepes no pot ser negatiu.", 'NumRepes', error);
    validate(exercici.NumRepes > 100, "NumRepes no pot ser major que 100.", 'NumRepes', error);
    validate(exercici.NumRepes === null, "NumRepes no pot ser buit.", 'NumRepes', error);
    validate(exercici.NumSeries === 0, "Obligatori", 'NumSeries', error);
    validate(exercici.NumSeries < 0, "NumSeries no pot ser negatiu.", 'NumSeries', error);
    validate(exercici.NumSeries > 100, "NumSeries no pot ser major que 100.", 'NumSeries', error);
    validate(exercici.NumSeries === null, "NumSeries no pot ser buit.", 'NumSeries', error);

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


