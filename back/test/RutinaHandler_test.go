package test

import (
	"strconv"
	"temple-app/handlers"
	"temple-app/models"

	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/assert/v2"
)

func CrearRutinaTest(entrenadorID uint) models.Rutina {

	e1 := crearExercici("e1")

	var rutina models.Rutina
	rutina.Nom = "Rutina Test"
	rutina.EntrenadorID = entrenadorID
	rutina.Descripcio = "Descripcio Test"
	rutina.Cicles = 1
	rutina.DiesDuracio = 1

	GetDBTest().Create(&rutina)

	var ExerciciRutina models.ExerciciRutina
	ExerciciRutina.RutinaID = rutina.ID
	ExerciciRutina.ExerciciID = e1.ID
	ExerciciRutina.Cicle = 0
	ExerciciRutina.PercentatgeRM = 50
	ExerciciRutina.DiaRutina = 1
	ExerciciRutina.NumRepes = 5
	ExerciciRutina.NumSeries = 5
	ExerciciRutina.Ordre = 0

	GetDBTest().Create(&ExerciciRutina)

	rutina.ExercicisRutina = append(rutina.ExercicisRutina, ExerciciRutina)

	return rutina
}

func AssignarRutina(user *models.Usuari, rutina *models.Rutina) {
	var r models.UsuariRutina
	r.RutinaID = rutina.ID
	r.UsuariID = user.ID

	GetDBTest().Create(&r)
}

func DeleteRutines() {
	GetDBTest().Exec("Delete from exercicis_rutina")
	GetDBTest().Exec("Delete from rutines")
	GetDBTest().Exec("Delete from exercicis")
}

func TestCreateRutina(t *testing.T) {

}

func TestAcabarRutina(t *testing.T) {

	defer func() {
		DeleteRutines()
		EliminarDadesAlumnes()
	}()

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	db := GetDBTest()
	handler := handlers.NewHandler(db)

	c := "12355"
	users := CrearEntrenador()
	user2 := CrearUsuariTest("Usuari Test 2", 2, &c, nil)
	r := CrearRutinaTest(users[0].ID)
	AssignarRutina(&users[1], &r)
	AssignarRutina(&user2, &r)

	router.Use(func(c *gin.Context) {
		c.Set("user", &users[0])
		c.Next()
	})

	router.POST("/entrenador/acabarRutina", handler.AcabarRutina)

	u1, err := json.Marshal(map[string]uint{"usuariID": users[1].ID})
	if err != nil {
		t.Errorf("Error al convertir el mapa a JSON: %v", []string{err.Error()})
	}
	userPost1 := u1

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/entrenador/acabarRutina", bytes.NewReader(userPost1))

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var result int64
	handler.DB.Table("usuari_rutina").Where("usuari_id = ? and data_finalitzacio is null", users[1].ID).Count(&result)

	assert.Equal(t, result, int64(0))

	w2 := httptest.NewRecorder()

	u2, err := json.Marshal(map[string]uint{"usuariID": user2.ID})

	if err != nil {
		t.Errorf("Error al convertir el mapa a JSON: %v", []string{err.Error()})
	}
	userPost2 := u2

	req2, _ := http.NewRequest("POST", "/entrenador/acabarRutina", bytes.NewReader(userPost2))

	router.ServeHTTP(w2, req2)
	assert.Equal(t, http.StatusUnauthorized, w2.Code)

	var result2 int64
	handler.DB.Table("usuari_rutina").Where("usuari_id = ? and data_finalitzacio is null", user2.ID).Count(&result2)

	assert.Equal(t, result2, int64(1))
}

func TestUpdateRutina(t *testing.T) {

	defer func() {
		DeleteRutines()
		EliminarDadesAlumnes()
		EliminarDadesExercici()
	}()

	db := GetDBTest()
	handler := handlers.NewHandler(db)

	users := CrearEntrenador()
	r := CrearRutinaTest(users[0].ID)

	rutinaJSON, err := json.Marshal(map[string]interface{}{
		"nom":         "Canvi Test",
		"descripcio":  "Descripcio Test",
		"cicles":      1,
		"diesDuracio": 1,
		"exercicis": []models.ExerciciRutinaUpdateInput{
			{
				ID:            r.ExercicisRutina[0].ID,
				ExerciciRutinaBase: models.ExerciciRutinaBase{
					ExerciciID:    r.ExercicisRutina[0].ExerciciID,
					NumRepes:      10,
					NumSeries:     5,
					PercentatgeRM: 50,
					Ordre:         0,
					Cicle:         0,
					DiaRutina:     0,
				},
			},
		},
	})

	rutinaJSON2, err2 := json.Marshal(map[string]interface{}{
		"nom":         "Rutina Test",
		"descripcio":  "Descripcio Test",
		"cicles":      1,
		"diesDuracio": 1,
		"exercicis": []models.ExerciciRutinaUpdateInput{
			{
				ID:            r.ExercicisRutina[0].ID,
				ExerciciRutinaBase: models.ExerciciRutinaBase{
					ExerciciID:    r.ExercicisRutina[0].ExerciciID,
					NumRepes:      10,
					NumSeries:     5,
					PercentatgeRM: 50,
					Ordre:         0,
					Cicle:         0,
					DiaRutina:     0,
				},
			},
			{
				ExerciciRutinaBase: models.ExerciciRutinaBase{
					ExerciciID:    r.ExercicisRutina[0].ExerciciID,
					NumRepes:      10,
					NumSeries:     5,
					PercentatgeRM: 50,
					Ordre:         1,
					Cicle:         0,
					DiaRutina:     0,
				},
			},
		},
	})

	rutinaJSON3, err3 := json.Marshal(map[string]interface{}{
		"nom":         "Rutina Test",
		"descripcio":  "Descripcio Test",
		"cicles":      1,
		"diesDuracio": 1,
		"exercicis": []models.ExerciciRutinaInput{
			{
				ExerciciRutinaBase: models.ExerciciRutinaBase{
					NumRepes:      10,
					NumSeries:     5,
					PercentatgeRM: 50,
					Ordre:         0,
					Cicle:         0,
					DiaRutina:     5,
				},
			},
		},
	})

	if err != nil || err2 != nil || err3 != nil {
		t.Errorf("Error al convertir el mapa a JSON: %v", []string{err.Error()})
	}

	w := httptest.NewRecorder()

	req, _ := http.NewRequest("PUT", "/rutines/"+strconv.Itoa(int(r.ID)), bytes.NewReader(rutinaJSON))
	req.Header.Set("Content-Type", "application/json")

	router := gin.Default()

	router.Use(func(c *gin.Context) {
		c.Set("user", &users[0])
		c.Next()
	})

	router.PUT("/rutines/:id", handler.UpdateRutina)

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response1 models.Rutina

	err = db.Preload("ExercicisRutina").First(&response1, r.ID).Error

	assert.Equal(t, nil, err)
	assert.Equal(t, "Canvi Test", response1.Nom)
	assert.Equal(t, uint(10), response1.ExercicisRutina[0].NumRepes)
	assert.Equal(t, 1, len(response1.ExercicisRutina))

	w2 := httptest.NewRecorder()

	req2, _ := http.NewRequest("PUT", "/rutines/"+strconv.Itoa(int(r.ID)), bytes.NewReader(rutinaJSON2))

	router.ServeHTTP(w2, req2)

	assert.Equal(t, http.StatusOK, w2.Code)

	rutina := models.Rutina{}
	handler.DB.Table("rutines").Preload("ExercicisRutina").Where("id = ?", r.ID).First(&rutina)

	assert.Equal(t, http.StatusOK, w2.Code)
	assert.Equal(t, 2, len(rutina.ExercicisRutina))

	w3 := httptest.NewRecorder()

	req3, _ := http.NewRequest("PUT", "/rutines/"+strconv.Itoa(int(r.ID)), bytes.NewReader(rutinaJSON3))

	router.ServeHTTP(w3, req3)

	assert.NotEqual(t, http.StatusOK, w3.Code)

	rutina = models.Rutina{}
	handler.DB.Table("rutines").Preload("ExercicisRutina").Where("id = ?", r.ID).First(&rutina)
	assert.Equal(t, 2, len(rutina.ExercicisRutina))

}
