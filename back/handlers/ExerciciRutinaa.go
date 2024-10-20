package handlers

import (
	"net/http"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) AfegirExercici(c *gin.Context) {
	var rutina models.Rutina
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: err.Error()})
		return
	}

	if rutina.EntrenadorID != c.MustGet("user").(models.Usuari).ID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
		return
	}

	var input models.ExerciciRutinaInput

	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	if err = h.DB.Create(&input).Error; err != nil{
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to aappend exercici"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": rutina})
}

func (h *Handler) LlevarExercici(c *gin.Context) {

	var rutina models.Rutina
	var err error

	if err = h.DB.Where("id = ?", c.Query("rutinaId")).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: err.Error()})
		return
	}

	if rutina.EntrenadorID != c.MustGet("user").(models.Usuari).ID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
		return
	}

	var exercici models.ExerciciRutina

	if err = h.DB.Where("id = ?", c.Query("exerciciId")).First(&exercici).Error; err != nil{
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Exercici no trobat"})
	}

	if err = h.DB.Delete(&exercici).Error; err != nil{
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete exercici from rutina"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": rutina})
}
