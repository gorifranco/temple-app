package test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strconv"
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

// Index
func TestSolicitudsEntrenador(t *testing.T) {
	defer func() {
		EliminarDadesSolicitudesEntrenador()
	}()

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	db := GetDBTest()
	handler := handlers.NewHandler(db)

	codi := "1234"
	entrenador := CrearUsuariTest("Entrenador Test", 3, &codi, nil)
	usuari := CrearUsuariTest("Usuari Test", 3, &codi, nil)
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

// Create
func TestSolicitarUnioEntrenador(t *testing.T) {
	defer func() {
		EliminarDadesSolicitudesEntrenador()
	}()
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	db := GetDBTest()
	handler := handlers.NewHandler(db)

	codi := "1234"
	CrearUsuariTest("Entrenador Test", 3, &codi, nil)
	usuari := CrearUsuariTest("Usuari Test", 3, &codi, nil)

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

// Accept
func TestAcceptSolicitudUnioEntrenador(t *testing.T) {
	defer func() {
		EliminarDadesSolicitudesEntrenador()
	}()

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	db := GetDBTest()
	handler := handlers.NewHandler(db)

	codi := "1234"
	usuari := CrearUsuariTest("Usuari Test", 3, &codi, nil)
	entrenador := CrearEntrenador() //[0]-> entrenador, [1]->Alumne1, [2]->Alumne2
	solicitud1 := CrearSolicitudUnioEntrenador(usuari.ID, entrenador[0].ID)

	router.Use(func(c *gin.Context) {
		c.Set("user", &entrenador[0])
		c.Next()
	})

	router.PUT("/api/solicituds/:id/aceptar", handler.AcceptarSolicitudUnioEntrenador)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/api/solicituds/"+strconv.Itoa(int(solicitud1.ID))+"/aceptar", nil)

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var count int64
	handler.DB.Table("usuaris").Where("entrenador_id = ?", entrenador[0].ID).Count(&count)
	assert.Equal(t, int64(3), count)

	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("PUT", "/api/solicituds/"+strconv.Itoa(int(solicitud1.ID))+"/aceptar", nil)

	router.ServeHTTP(w2, req2)
	assert.Equal(t, http.StatusBadRequest, w2.Code)

}


// Decline
func TestDeclineSolicitudUnioEntrenador(t *testing.T) {
	defer func() {
		EliminarDadesSolicitudesEntrenador()
	}()

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	db := GetDBTest()
	handler := handlers.NewHandler(db)

	codi := "1234"
	usuari := CrearUsuariTest("Usuari Test", 3, &codi, nil)
	entrenador := CrearUsuariTest("Usuari Test 2", 2, &codi, nil)
	solicitud1 := CrearSolicitudUnioEntrenador(usuari.ID, entrenador.ID)

	router.Use(func(c *gin.Context) {
		c.Set("user", &entrenador)
		c.Next()
	})

	router.PUT("/api/solicituds/:id/declinar", handler.DeclinarSolicitudUnioEntrenador)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/api/solicituds/"+strconv.Itoa(int(solicitud1.ID))+"/declinar", nil)

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var count int64
	handler.DB.Table("usuaris").Where("entrenador_id = ?", entrenador.ID).Count(&count)
	assert.Equal(t, int64(0), count)


	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("PUT", "/api/solicituds/"+strconv.Itoa(int(solicitud1.ID))+"/declinar", nil)

	router.ServeHTTP(w2, req2)
	assert.Equal(t, http.StatusBadRequest, w2.Code)
}
