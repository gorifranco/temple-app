package test

import (
	"temple-app/handlers"
	"temple-app/models"

	"bytes"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/assert/v2"
	"net/http"
	"net/http/httptest"
	"testing"
)

func CrearRutinaTest(entrenadorID uint) models.Rutina {

	var rutina models.Rutina
	rutina.Nom = "Rutina Test"
	rutina.EntrenadorID = entrenadorID
	rutina.Descripcio = "Descripcio Test"
	rutina.Cicles = 1
	rutina.DiesDuracio = 1

	GetDBTest().Create(&rutina)

	var ExerciciRutina models.ExerciciRutina
	ExerciciRutina.RutinaID = rutina.ID
	ExerciciRutina.ExerciciID = 1
	ExerciciRutina.Cicle = 0
	ExerciciRutina.PercentatgeRM = 50
	ExerciciRutina.DiaRutina = 1
	ExerciciRutina.NumRepes = 5
	ExerciciRutina.NumSeries = 5
	ExerciciRutina.Ordre = 0

	GetDBTest().Create(&ExerciciRutina)

	return rutina
}

func DeleteRutines() {
	GetDBTest().Exec("Delete from exercicis_rutina")
	GetDBTest().Exec("Delete from rutines")
}

func TestCreateRutina(t *testing.T) {
	defer func() {
		DeleteRutines()
		EliminarDadesAlumnes()
	}()
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	db := GetDBTest()
	handler := handlers.NewHandler(db)

	codi := "1234"
	entrenador := CrearUsuariTest("Entrenador Test", 3, &codi)

	router.Use(func(c *gin.Context) {
		c.Set("user", &entrenador)
		c.Next()
	})

	router.POST("/api/rutines", handler.CreateRutina)

	w := httptest.NewRecorder()

	exercicis := []models.ExerciciRutinaInput{
		{
			ExerciciID:    1,
			NumRepes:      5,
			NumSeries:     5,
			PercentatgeRM: 50,
			Ordre:         0,
		},
	}

	rutinaJSON, err := json.Marshal(map[string]interface{}{
		"nom":         "Rutina Test",
		"descripcio":  "Descripcio Test",
		"cicles":      1,
		"diesDuracio": 1,
		"exercicis":   exercicis,
	})
	if err != nil {
		t.Errorf("Error al convertir el mapa a JSON: %v", []string{err.Error()})
	}

	req, _ := http.NewRequest("POST", "/api/rutines", bytes.NewReader(rutinaJSON))
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]models.RutinaResponse
	json.Unmarshal(w.Body.Bytes(), &response)

	assert.Equal(t, "Rutina Test", response["data"].Nom)
	assert.Equal(t, http.StatusOK, w.Code)

	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("POST", "/api/rutines", bytes.NewReader(rutinaJSON))
	req2.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w2, req2)

	assert.Equal(t, http.StatusConflict, w2.Code)

	w3 := httptest.NewRecorder()
	req3, _ := http.NewRequest("POST", "/api/rutines", bytes.NewReader(rutinaJSON))
	req3.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w3, req3)

	assert.Equal(t, http.StatusBadRequest, w3.Code)
}
