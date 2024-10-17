package test

import (
	"temple-app/models"

)

func CrearRutinaTest(entrenadorID uint) models.Rutina {

	var rutina models.Rutina
	rutina.Nom = "Rutina Test"
	rutina.EntrenadorID = entrenadorID
	rutina.Descripcio = "Descripcio Test"

	GetDBTest().Create(&rutina)

	return rutina
}