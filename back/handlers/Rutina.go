package handlers

import (
	"net/http"
	"temple-app/auth"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) IndexRutina(c *gin.Context) {
	var rutinas []models.Rutina
	h.DB.Find(&rutinas)

	c.JSON(http.StatusOK, gin.H{"data": rutinas})
}

func (h *Handler) CreateRutina(c *gin.Context) {
	var input models.RutinaInput
	var err error
	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rutina := models.Rutina{Nom: input.Nom, Descripcio: input.Descripcio, EntrenadorID: auth.GetUsuari(c)}

	err = h.DB.Create(&rutina).Error

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create rutina"})
		return
	}

	var createdRutina models.Rutina
	h.DB.First(&createdRutina, rutina.ID)

	c.JSON(http.StatusOK, gin.H{"data": createdRutina})
}

func (h Handler) UpdateRutina(c *gin.Context) {
	var rutina models.Rutina
	if err := h.DB.Where("id = ?", c.Param("id")).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
	}

	var input models.RutinaInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedRutina := models.Rutina{Nom: input.Nom, Descripcio: input.Descripcio}

	h.DB.Model(&rutina).Updates(&updatedRutina)

	var uu models.Rutina
	h.DB.Preload("Exercicis").First(&uu, c.Param("id"))

	c.JSON(http.StatusOK, gin.H{"data": uu})
}

func (h *Handler) DeleteRutina(c *gin.Context) {
	var rutina models.Rutina
	if err := h.DB.Where("id = ?", c.Param("id")).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}

	h.DB.Delete(&rutina)
	c.JSON(http.StatusOK, gin.H{"data": "success"})
}

func (h *Handler) RutinesEntrenador(c *gin.Context) {
	var rutines []models.Rutina

	h.DB.Find(&rutines).Where("entrenador_id = ?", auth.GetUsuari(c)).Preload("Exercicis")

	c.JSON(http.StatusOK, gin.H{"data": rutines})
}
