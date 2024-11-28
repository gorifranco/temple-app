package validators

import (
	"errors"
	"fmt"
	"sort"
	"temple-app/models"

	"gorm.io/gorm"
)

func RutinaValidator(rutina *models.RutinaInput, db *gorm.DB) []error {
	var errs []error

	if rutina.Nom == "" {
		errs = append(errs, errors.New("nom de la rutina no pot ser buit"))
	}
	if rutina.Cicles <= 0 {
		errs = append(errs, errors.New("cicles de la rutina no pot estar buit"))
	}
	if rutina.DiesDuracio <= 0 {
		errs = append(errs, errors.New("DiesDuracio de la rutina no pot estar buit"))
	}
	if rutina.DiesDuracio > 7 {
		errs = append(errs, errors.New("DiesDuracio de la rutina no pot ser superior a 7"))
	}
	if len(rutina.Exercicis) == 0 {
		errs = append(errs, errors.New("exercicis de la rutina no pot estar buit"))
	}

	// Recuperar IDs válidos de ejercicios
	var ids []uint
	if err := db.Table("exercicis").Where("deleted_at IS NULL").Pluck("id", &ids).Error; err != nil {
		errs = append(errs, fmt.Errorf("error al recuperar IDs de exercicis: %v", err))
	}

	// Convertir la lista de IDs a un mapa para validación rápida
	exerciseIDMap := make(map[uint]bool)
	for _, id := range ids {
		exerciseIDMap[id] = true
	}

	// Inicializar el mapa anidado para ordres
	ordres := make(map[uint]map[uint][]uint)

	// Validar cada ejercicio
	for _, exercici := range rutina.Exercicis {
		if !exerciseIDMap[exercici.ExerciciID] {
			errs = append(errs, fmt.Errorf("exercici no existeix: %d", exercici.ExerciciID))
		}
		if exercici.NumRepes <= 0 {
			errs = append(errs, errors.New("NumRepes no pot estar buit"))
		}
		if exercici.Cicle > rutina.Cicles {
			errs = append(errs, errors.New("cicle de l'exercici no coincideix amb els cicles de la rutina"))
		}
		if exercici.DiaRutina >= rutina.DiesDuracio {
			errs = append(errs, errors.New("dia de l'exercici no coincideix amb els dies de duració de la rutina"))
		}

		// Inicializar mapa anidado si no existe
		if ordres[exercici.Cicle] == nil {
			ordres[exercici.Cicle] = make(map[uint][]uint)
		}

		// Agregar el orden al mapa
		ordres[exercici.Cicle][exercici.DiaRutina] = append(ordres[exercici.Cicle][exercici.DiaRutina], uint(exercici.Ordre))
	}

	// Validar que los ordres sean consecutivos en cada cicle y diaRutina
	for cicle, ordresPerDia := range ordres {
		for diaRutina, ordresDia := range ordresPerDia {
			if len(ordresDia) > 1 {
				// Ordenar los ordres dentro de un día
				sort.Slice(ordresDia, func(i, j int) bool {
					return ordresDia[i] < ordresDia[j]
				})
				// Validar consecutividad
				for i := 1; i < len(ordresDia); i++ {
					if ordresDia[i] != ordresDia[i-1]+1 {
						errs = append(errs, fmt.Errorf(
							"els ordres no estan consecutius en el cicle %d, dia %d", cicle, diaRutina,
						))
					}
				}
			}
		}
	}

	return errs
}