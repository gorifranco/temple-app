package test

import (
	"temple-app/models"
)

func CrearUsuariTest(nom string, tipusUsuariID uint, codiEntrenador *string) models.Usuari {
	var usuari models.Usuari
	usuari.Nom = nom
	usuari.TipusUsuariID = tipusUsuariID
	usuari.CodiEntrenador = *codiEntrenador

	GetDBTest().Create(&usuari)

	return usuari
}
