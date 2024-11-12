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

func AssignarRutina(user *models.Usuari, rutina *models.Rutina) {
	var r models.UsuariRutina
	r.RutinaID = rutina.ID
	r.UsuariID = user.ID

	GetDBTest().Create(&r)
}

func DeleteRutines() {
	GetDBTest().Exec("Delete from exercicis_rutina")
	GetDBTest().Exec("Delete from rutines")
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
