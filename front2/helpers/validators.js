export function nomSalaValidator(nom) {
    if (!nom) return "Nom no pot ser buit."
    if (nom.length < 2) return 'Nom massa curt.'
    if(nom.length > 15) return 'Nom massa llarg.'
    return ''
  }