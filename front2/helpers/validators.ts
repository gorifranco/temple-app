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
      Nom: "",
      PercentatgeRM: "",
      NumRepes: "",
      NumSeries: "",
    };

    // Validaciones
    validate(exercici.Nom.length === 0, "Nom no pot ser buit.", 'Nom', error);
    validate(exercici.Nom.length < 2 && exercici.Nom.length > 0, "Nom massa curt.", 'Nom', error);
    validate(exercici.Nom.length > 15, "Nom massa llarg.", 'Nom', error);
    validate(exercici.PercentatgeRM < 0 || exercici.PercentatgeRM > 100, "Percentatge RM no pot ser menor a 0 o superior a 100.", 'PercentatgeRM', error);
    validate(exercici.PercentatgeRM === null, "Percentatge RM no pot ser buit.", 'PercentatgeRM', error);
    validate(exercici.NumRepes < 0 || exercici.NumRepes > 100, "NumRepes no pot ser menor a 0 o superior a 100.", 'NumRepes', error);
    validate(exercici.NumRepes === null, "NumRepes no pot ser buit.", 'NumRepes', error);
    validate(exercici.NumSeries < 0 || exercici.NumSeries > 100, "NumSeries no pot ser menor a 0 o superior a 100.", 'NumSeries', error);
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


