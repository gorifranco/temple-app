package test

import (
	"bytes"
	"encoding/json"
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

func EliminarDadesAlumnes() {
	GetDBTest().Exec("delete from usuaris where nom like 'Alumne Test%'")
	GetDBTest().Exec("delete from usuaris")
	GetDBTest().Exec("delete from usuari_rutina")
	GetDBTest().Exec("delete from usuari_resultat_exercici")
}

func TestAlumnesEntrenador(t *testing.T) {

	//Al acabar elimina Els usuaris de la base de dades
	defer func() {
		EliminarDadesAlumnes()
	}()

	db := GetDBTest()
	handler := handlers.NewHandler(db)

	gin.SetMode(gin.TestMode)
    router := gin.Default()
	entrenador := CrearEntrenador()[0]

	//Introdueix l'id de l'entrenador al router
	router.Use(func(c *gin.Context) {
        c.Set("user", &entrenador)
        c.Next()
    })

	//Crea la ruta
	router.GET("/api/entrenador/alumnes", handler.AlumnesEntrenador)
	
	w := httptest.NewRecorder()

	req, _ := http.NewRequest("GET", "/api/entrenador/alumnes", nil)
    req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

    var response struct {
        Data []models.Usuari `json:"data"`
    }

	//Tradueix el JSON a un struct
	json.Unmarshal(w.Body.Bytes(), &response)

	assert.Equal(t, 2, len(response.Data))
}

func TestCreateUsuariFictici(t *testing.T) {

	defer func() {
		EliminarDadesAlumnes()
	}()

	db := GetDBTest()
	handler := handlers.NewHandler(db)
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	entrenador := CrearEntrenador()[0]

	router.Use(func(c *gin.Context) {
        c.Set("user", &entrenador)
        c.Next()
    })

	router.POST("/api/entrenador/usuarisFicticis", handler.CrearUsuariFictici)

	w := httptest.NewRecorder()

	usuariJSON, err := json.Marshal(map[string]interface{}{
		"nom": "Alumne Test 1",
	})

	usuariJSON2, err2 := json.Marshal(map[string]interface{}{
		"nom": "",
	})

	if err != nil || err2 != nil {
		t.Errorf("Error al convertir el mapa a JSON: %v", []string{err.Error()})
	}

	req, _ := http.NewRequest("POST", "/api/entrenador/usuarisFicticis", bytes.NewReader(usuariJSON))
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]models.Usuari
	json.Unmarshal(w.Body.Bytes(), &response)

	assert.Equal(t, "Alumne Test 1", response["data"].Nom)

	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("POST", "/api/entrenador/usuarisFicticis", bytes.NewReader(usuariJSON2))
	req2.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w2, req2)

	assert.Equal(t, http.StatusBadRequest, w2.Code)
}


