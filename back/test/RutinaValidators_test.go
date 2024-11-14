package test

import (
	"temple-app/models"
	"temple-app/validators"
	"testing"

	"github.com/go-playground/assert/v2"
)

func TestRutinaValidator(t *testing.T) {
	defer func() {
		DeleteRutines()
		EliminarDadesAlumnes()
		EliminarDadesExercici()
	}()

	e1 := crearExercici("et1")
	e2 := crearExercici("et2")

	//Creation of the correct routine
	exercici1 := models.ExerciciRutinaInput{
		ExerciciRutinaBase: models.ExerciciRutinaBase{
			ExerciciID:    e1.ID,
			NumRepes:      5,
			NumSeries:     5,
			PercentatgeRM: 50,
			Ordre:         0,
			Cicle:         0,
			DiaRutina:     0,
		},
	}
	exercici2 := models.ExerciciRutinaInput{
		ExerciciRutinaBase: models.ExerciciRutinaBase{
			ExerciciID:    e2.ID,
			NumRepes:      5,
			NumSeries:     5,
			PercentatgeRM: 50,
			Ordre:         1,
			Cicle:         0,
			DiaRutina:     0,
		},
	}

	rutina := models.RutinaInput{Nom: "Rutina Test", Cicles: 1, DiesDuracio: 1, Exercicis: []models.ExerciciRutinaInput{exercici1, exercici2},
		Descripcio: "Descripcio Test"}

	db := GetDBTest()

	response1 := validators.RutinaValidator(&rutina, db)

	assert.Equal(t, len(response1), 0)

	rutina.Exercicis[0].NumRepes = 0
	assert.Equal(t, len(validators.RutinaValidator(&rutina, db)), 1)

	rutina.Exercicis[0].Ordre = 3
	assert.Equal(t, len(validators.RutinaValidator(&rutina, db)), 2)

	rutina.Exercicis[0].Cicle = 2
	assert.Equal(t, len(validators.RutinaValidator(&rutina, db)), 2)
	
	rutina.Exercicis[0].DiaRutina = 2
	assert.Equal(t, len(validators.RutinaValidator(&rutina, db)), 3)

}
