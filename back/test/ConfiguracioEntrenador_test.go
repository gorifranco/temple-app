package test

import (
	"net/http"
	"net/http/httptest"
	"temple-app/handlers"
	"temple-app/models"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/assert/v2"
)

func CreateConfig(usuari *models.Usuari, alumnesPerSessio uint, duracioSessions uint) {
	config := models.ConfiguracioEntrenador{DuracioSessions: duracioSessions, MaxAlumnesPerSessio: alumnesPerSessio, EntrenadorID: usuari.ID}
	GetDBTest().Create(&config)
}

func DeleteConfig() {
	GetDBTest().Exec("delete from configuracio_entrenador")
}

func TestFindConfigEntrenador(t *testing.T) {
	defer func() {
		DeleteConfig()
		EliminarDadesAlumnes()
	}()

	gin.SetMode(gin.TestMode)
	router1 := gin.Default()
	db := GetDBTest()
	handler := handlers.NewHandler(db)

	codi := "1234"
	entrenador := CrearEntrenador()
	usuari := CrearUsuariTest("Usuari Test Incorrecte", 4, &codi, nil)
	CreateConfig(&entrenador[0], 4, 60)

	router1.Use(func(c *gin.Context) {
		c.Set("user", &entrenador[0])
		c.Next()
	})

	router1.GET("/api/configuracioEntrenador", handler.FindConfiguracioEntrenador)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/configuracioEntrenador", nil)

	router1.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)


	router2 := gin.Default()
	router2.Use(func(c *gin.Context) {
		c.Set("user", &entrenador[1])
		c.Next()
	})
	router2.GET("/api/configuracioEntrenador", handler.FindConfiguracioEntrenador)

	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("GET", "/api/configuracioEntrenador", nil)

	router2.ServeHTTP(w2, req2)

	assert.Equal(t, http.StatusOK, w2.Code)

	router3 := gin.Default()
	router3.Use(func(c *gin.Context) {
		c.Set("user", &usuari)
		c.Next()
	})
	router3.GET("/api/configuracioEntrenador", handler.FindConfiguracioEntrenador)

	w3 := httptest.NewRecorder()
	req3, _ := http.NewRequest("GET", "/api/configuracioEntrenador", nil)

	router3.ServeHTTP(w3, req3)

	assert.Equal(t, http.StatusBadRequest, w3.Code)
}