package test

import (
	"temple-app/models"
)

func CrearUsuariTest(nom string, tipusUsuariID uint, codiEntrenador *string, entrenadorID *uint) models.Usuari {
	var usuari models.Usuari
	usuari.Nom = nom
	usuari.TipusUsuariID = tipusUsuariID
	usuari.CodiEntrenador = *codiEntrenador
	usuari.EntrenadorID = entrenadorID	

	GetDBTest().Create(&usuari)

	return usuari
}
