package test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"temple-app/handlers"
	"temple-app/models"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/assert/v2"
)

func CrearEntrenador() []models.Usuari {

	codi := "1234"
	c2 := ""
	entrenador := CrearUsuariTest("Entrenador Test", 3, &codi, nil)

	alumne1 := CrearUsuariTest("Alumne Test 1", 2, &c2, &entrenador.ID)
	alumne2 := CrearUsuariTest("Alumne Test 2", 4, &c2, &entrenador.ID)

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

// Update
func TestUpdateUsuariFictici(t *testing.T) {

	defer func() {
		EliminarDadesAlumnes()
	}()

	db := GetDBTest()
	handler := handlers.NewHandler(db)
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	entrenador := CrearEntrenador()
	entrenador2 := CrearEntrenador()

	router.Use(func(c *gin.Context) {
		c.Set("user", &entrenador[0])
		c.Next()
	})

	router.PUT("/api/entrenador/usuarisFicticis/:id", handler.UpdateUsuariFictici)

	w := httptest.NewRecorder()

	usuariJSON, err := json.Marshal(map[string]interface{}{
		"nom": "Alumne Test Canviat",
	})

	usuariJSON2, err2 := json.Marshal(map[string]interface{}{
		"nom": "",
	})

	if err != nil || err2 != nil {
		t.Errorf("Error al convertir el mapa a JSON: %v", []string{err.Error()})
	}

	req, _ := http.NewRequest("PUT", "/api/entrenador/usuarisFicticis/"+strconv.Itoa(int(entrenador[2].ID)), bytes.NewReader(usuariJSON))
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	usuari := models.Usuari{}
	handler.DB.Table("usuaris").Where("id = ?", entrenador[2].ID).First(&usuari)
	assert.Equal(t, "Alumne Test Canviat", usuari.Nom)


	//Not false user
	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("PUT", "/api/entrenador/usuarisFicticis/"+strconv.Itoa(int(entrenador[1].ID)), bytes.NewReader(usuariJSON2))
	req2.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w2, req2)

	assert.Equal(t, http.StatusUnauthorized, w2.Code)

	//Empty name
	w3 := httptest.NewRecorder()
	req3, _ := http.NewRequest("PUT", "/api/entrenador/usuarisFicticis/"+strconv.Itoa(int(entrenador[2].ID)), bytes.NewReader(usuariJSON2))
	req3.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w3, req3)

	assert.Equal(t, http.StatusBadRequest, w3.Code)

	//Not his student
	w4 := httptest.NewRecorder()
	req4, _ := http.NewRequest("PUT", "/api/entrenador/usuarisFicticis/"+strconv.Itoa(int(entrenador2[1].ID)), bytes.NewReader(usuariJSON))
	req4.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w4, req4)

	assert.Equal(t, http.StatusUnauthorized, w4.Code)
}

//Kick user
func TestExpulsarUsuari(t *testing.T) {
	defer func() {
		EliminarDadesAlumnes()
	}()

	db := GetDBTest()
	handler := handlers.NewHandler(db)
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	entrenador1 := CrearEntrenador()
	entrenador2 := CrearEntrenador()

	router.Use(func(c *gin.Context) {
		c.Set("user", &entrenador1[0])
		c.Next()
	})

	router.PUT("/api/entrenador/alumnes/:id/expulsar", handler.ExpulsarUsuari)

	w := httptest.NewRecorder()

	req, _ := http.NewRequest("PUT", "/api/entrenador/alumnes/"+strconv.Itoa(int(entrenador1[1].ID))+"/expulsar", nil)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var count int64
	handler.DB.Table("usuaris").Where("entrenador_id = ?", entrenador1[0].ID).Count(&count)
	assert.Equal(t, int64(1), count)

	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("PUT", "/api/entrenador/alumnes/"+strconv.Itoa(int(entrenador1[2].ID))+"/expulsar", nil)
	req2.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w2, req2)

	assert.Equal(t, http.StatusOK, w2.Code)

	handler.DB.Table("usuaris").Where("deleted_at is not null").Count(&count)
	assert.Equal(t, int64(1), count)

	//Not his student
	w3 := httptest.NewRecorder()
	req3, _ := http.NewRequest("PUT", "/api/entrenador/alumnes/"+strconv.Itoa(int(entrenador2[1].ID))+"/expulsar", nil)
	req3.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w3, req3)

	assert.Equal(t, http.StatusUnauthorized, w3.Code)
}
