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

export function exercicisValidator(exercicis: ExerciciRutinaType[]) {
  let errors = new Map<number, ExerciciErrorType>()
  for (let i = 0; i < exercicis.length; i++) {
    const error: ExerciciErrorType = {
      Nom: "",
      PercentatgeRM: "",
      NumRepes: "",
      NumSeries: "",
    }

    if (exercicis[i].Nom.length === 0) error.Nom = "Nom no pot ser buit.";
    if (exercicis[i].Nom.length < 2 && exercicis[i].Nom.length > 0) error.Nom = "Nom massa curt.";
    if (exercicis[i].Nom.length > 15) error.Nom = "Nom massa llarg.";
    if (exercicis[i].PercentatgeRM < 0 || exercicis[i].PercentatgeRM > 100) error.PercentatgeRM = "Percentatge RM no pot ser menor a 0 o superior a 100.";
    if (exercicis[i].PercentatgeRM === null) error.PercentatgeRM = "Percentatge RM no pot ser buit.";
    if (exercicis[i].NumRepes < 0 || exercicis[i].NumRepes > 100) error.NumRepes = "NumRepes no pot ser menor a 0 o superior a 100.";
    if (exercicis[i].NumRepes === null) error.NumRepes = "NumRepes no pot ser buit.";
    if (exercicis[i].NumSeries < 0 || exercicis[i].NumSeries > 100) error.NumSeries = "NumSeries no pot ser menor a 0 o superior a 100.";
    if (exercicis[i].NumSeries === null) error.NumSeries = "NumSeries no pot ser buit."

    errors.set(i, error)
  }
}

function ciclesValidator(cicles: number) {
  if (cicles < 1) return "Cicles no pot ser menor que 1"
  if (cicles > 100) return "Cicles no pot ser superior a 100."
  return ''
}

function diesValidator(dies: number) {
  if (dies < 1) return "Dies no pot ser menor que 1"
  if (dies > 100) return "Dies no pot ser superior a 100."
  return ''
}


