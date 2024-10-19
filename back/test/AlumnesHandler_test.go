package test

import (
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

	//Al acabar elimina Els usuaris de la base de dades
	defer func() {
		EliminarDadesAlumnes()
	}()

	db := GetDBTest()
	handler := handlers.NewHandler(db)

	gin.SetMode(gin.TestMode)
    router := gin.Default()
	entrenador := CrearEntrenador()[0]

	//INtrodueix l'id de l'entrenador al router
	router.Use(func(c *gin.Context) {
        c.Set("id", entrenador.ID)
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

	json.Unmarshal(w.Body.Bytes(), &response)

	assert.Equal(t, 2, len(response.Data))
}
