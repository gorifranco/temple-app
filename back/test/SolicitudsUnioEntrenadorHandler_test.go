package test

import (
	"bytes"
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

func CrearSolicitudUnioEntrenador(usuariID uint, entrenadorID uint) models.SolicitudUnioEntrenador {
	solicitud := models.SolicitudUnioEntrenador{UsuariID: usuariID, EntrenadorID: entrenadorID}
	GetDBTest().Create(&solicitud)

	return solicitud
}


func EliminarDadesSolicitudesEntrenador() {
	GetDBTest().Exec("delete from solicituds_unio_entrenador")
	EliminarDadesAlumnes()
}


//Index
func TestSolicitudsEntrenador(t *testing.T) {
	defer func() {
		EliminarDadesSolicitudesEntrenador()
	}()

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	db := GetDBTest()
	handler := handlers.NewHandler(db)
	
	codi := "1234"
	entrenador := CrearUsuariTest("Entrenador Test", 3, &codi)
	usuari := CrearUsuariTest("Usuari Test", 3, &codi)
	solicitud := CrearSolicitudUnioEntrenador(usuari.ID, entrenador.ID)
	
	router.Use(func(c *gin.Context) {
		c.Set("user", &entrenador)
		c.Next()
	})

	router.GET("/api/solicituds", handler.SolicitudsEntrenador)


	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/solicituds", nil)

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string][]models.SolicitudUnioEntrenadorResponse
	json.Unmarshal(w.Body.Bytes(), &response)

	assert.Equal(t, 1, len(response))
	assert.Equal(t, solicitud.UsuariID, response["data"][0].UsuariID)
}


//Create
func TestSolicitarUnioEntrenador(t *testing.T) {
	defer func() {
		EliminarDadesSolicitudesEntrenador()
	}()
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	db := GetDBTest()
	handler := handlers.NewHandler(db)

	codi := "1234"
	CrearUsuariTest("Entrenador Test", 3, &codi)
	usuari := CrearUsuariTest("Usuari Test", 3, &codi)

	router.Use(func(c *gin.Context) {
		c.Set("user", &usuari)
		c.Next()
	})

	router.POST("/api/solicitudUnioEntrenador", handler.SolicitarUnioEntrenador)

	w := httptest.NewRecorder()
	solicitudJSON, _ := json.Marshal(map[string]interface{}{
		"codiEntrenador": "1234",
	})

	mockResponse, _ := json.Marshal(map[string]interface{}{
		"data": "success",
	})
	req, _ := http.NewRequest("POST", "/api/solicitudUnioEntrenador", bytes.NewReader(solicitudJSON))

	router.ServeHTTP(w, req)
	fmt.Print(w.Body.String())
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, mockResponse, w.Body.Bytes())

	w2 := httptest.NewRecorder()
	solicitudJSON2, _ := json.Marshal(map[string]interface{}{
		"codiEntrenador": "1235",
	})
	req2, _ := http.NewRequest("POST", "/api/solicitudUnioEntrenador", bytes.NewReader(solicitudJSON2))
	router.ServeHTTP(w2, req2)

	assert.Equal(t, http.StatusBadRequest, w2.Code)

	w3 := httptest.NewRecorder()
	req3, _ := http.NewRequest("POST", "/api/solicitudUnioEntrenador", bytes.NewReader(solicitudJSON))

	router.ServeHTTP(w3, req3)

	assert.Equal(t, http.StatusBadRequest, w3.Code)
}