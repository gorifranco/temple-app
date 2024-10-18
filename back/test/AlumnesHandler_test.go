package test

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"temple-app/handlers"
	"temple-app/models"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/assert/v2"
)


func CrearEntrenador() []models.Usuari {

	codi := "1234"
	c2 := ""
	entrenador := CrearUsuariTest("Entrenador Test", 3, &codi)

	alumne1 := CrearUsuariTest("Alumne Test 1", 2, &c2)
	alumne2 := CrearUsuariTest("Alumne Test 2", 2, &c2)

	entrenador.Alumnes = []models.Usuari{alumne1, alumne2}

	GetDBTest().Save(&entrenador)

	return []models.Usuari{entrenador, alumne1, alumne2}
}

func SetUpRouterAlumnes() *gin.Engine {
	router := gin.Default()

	db := GetDBTest()
	handler := handlers.NewHandler(db)

	router.GET("/api/entrenador/alumnes", handler.AlumnesEntrenador)
	router.POST("/api/usuarisFicticis", handler.CrearUsuariFictici)
	router.PUT("/api/usuarisFicticis/:id", handler.UpdateUsuariFictici)
	router.GET("/api/expulsarUsuari/:id", handler.ExpulsarUsuari)

	return router
}

func EliminarDadesAlumnes() {
	GetDBTest().Exec("delete from usuaris")
	GetDBTest().Exec("delete from usuari_rutina")
	GetDBTest().Exec("delete from usuari_resultat_exercici")
}

func TestAlumnesEntrenador(t *testing.T) {

	//https://canopas.com/golang-unit-tests-with-test-gin-context-80e1ac04adcd

	defer func() {
		EliminarDadesAlumnes()
	}()

	gin.SetMode(gin.TestMode)

	entrenador := CrearEntrenador()[0]

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/entrenador/alumnes", nil)

	c, _ := gin.CreateTestContext(w) 
	c.Set("id", entrenador.ID)

	fmt.Println(req.WithContext(c))

	router := SetUpRouterAlumnes()
	router.ServeHTTP(w, req.WithContext(c))

	assert.Equal(t, http.StatusOK, w.Code)

	var response []models.Usuari
	json.Unmarshal(w.Body.Bytes(), &response)

	assert.Equal(t, 2, len(response))
}
