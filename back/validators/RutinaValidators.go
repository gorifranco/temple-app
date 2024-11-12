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

	//IDs of the exercises
	var ids []uint
	if err := db.Table("exercicis").Where("deleted_at IS NULL").Pluck("id", &ids).Error; err != nil {
		errs = append(errs, fmt.Errorf("error al recuperar IDs de exercicis: %v", err))
	}

	// Convert the slice to a map for faster lookups
	exerciseIDMap := make(map[uint]bool)
	for _, id := range ids {
		exerciseIDMap[id] = true
	}

	// Initializa the map of ordres
	ordres := make(map[uint][]uint)

	// Validates every exercise
	for _, exercici := range rutina.Exercicis {
		if !exerciseIDMap[exercici.ExerciciID] {
			errs = append(errs, errors.New("exercici no existeix: "))
		}
		if exercici.NumRepes <= 0 {
			errs = append(errs, errors.New("NumRepes no pot estar buit"))
		}
		if exercici.Cicle > rutina.Cicles {
			errs = append(errs, errors.New("cicle de l'exercici no coincideix amb els cicles de la rutina"))
		}
		if exercici.DiaRutina > rutina.DiesDuracio-1{
			errs = append(errs, errors.New("dia de l'exercici no coincideix amb els dies de duració de la rutina"))
		}

		// Guardar el ordre en el mapa de ordres
		ordres[exercici.Cicle] = append(ordres[exercici.Cicle], uint(exercici.Ordre))
	}

	// Validar que los ordres sean consecutivos en cada cicle
	for _, ordresCicle := range ordres {
		if len(ordresCicle) > 1 {
			sort.Slice(ordresCicle, func(i, j int) bool {
				return ordresCicle[i] < ordresCicle[j]
			})
			for i := 1; i < len(ordresCicle); i++ {
				if ordresCicle[i] != ordresCicle[i-1]+1 {
					errs = append(errs, errors.New("els ordres no estan consecutius"))
				}
			}
		}
	}

	return errs
}
