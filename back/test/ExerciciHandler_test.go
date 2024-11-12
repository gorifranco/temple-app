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

func crearExercici(nom string) models.Exercici {
	var exercici models.Exercici
	exercici.Nom = nom

	GetDBTest().Create(&exercici)

	return exercici
}

func SetUpRouterExercici() *gin.Engine {
	router := gin.Default()

	db := GetDBTest()
	handler := handlers.NewHandler(db)

	router.POST("/api/exercicis", handler.CreateExercici)
	router.DELETE("/api/exercicis/:id", handler.DeleteExercici)

	return router
}

func EliminarDadesExercici() {
	GetDBTest().Exec("delete from exercicis")
}

func TestCreateExercici(t *testing.T) {

	defer func() {
		EliminarDadesExercici()
	}()

	exerciciJSON1, err1 := json.Marshal(map[string]interface{}{
		"nom": "Exercici test",
	})
	exerciciJSON2, err2 := json.Marshal(map[string]interface{}{
		"nom": "",
	})
	if err1 != nil || err2 != nil {
		t.Errorf("Error al convertir el mapa a JSON: %v", []string{err1.Error(), err2.Error()})
	}

	w := httptest.NewRecorder()

	req, _ := http.NewRequest("POST", "/api/exercicis", bytes.NewReader(exerciciJSON1))
	req.Header.Set("Content-Type", "application/json")

	router := SetUpRouterExercici()
	router.ServeHTTP(w, req)

	var response map[string]models.Exercici
	json.Unmarshal(w.Body.Bytes(), &response)

	assert.Equal(t, "Exercici test", response["data"].Nom)
	assert.Equal(t, http.StatusOK, w.Code)

	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("POST", "/api/exercicis", bytes.NewReader(exerciciJSON1))
	req2.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w2, req2)

	assert.Equal(t, http.StatusConflict, w2.Code)

	w3 := httptest.NewRecorder()
	req3, _ := http.NewRequest("POST", "/api/exercicis", bytes.NewReader(exerciciJSON2))
	req3.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w3, req3)

	assert.Equal(t, http.StatusBadRequest, w3.Code)
}

func TestDeleteExercici(t *testing.T) {

	exercici := crearExercici("Exercici Test")

	var count = int64(1)

	defer func() {
			EliminarDadesExercici()
	}()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/api/exercicis/"+strconv.Itoa(int(exercici.ID+1)), nil)

	router := SetUpRouterExercici()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)

	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("DELETE", "/api/exercicis/"+strconv.Itoa(int(exercici.ID)), nil)
	router.ServeHTTP(w2, req2)

	assert.Equal(t, http.StatusOK, w2.Code)

	db.Model(&models.Exercici{}).Where("id = ?", exercici.ID).Count(&count)
	assert.Equal(t, int64(0), count)
}
