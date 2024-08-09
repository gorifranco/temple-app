package handlers

import (
	"net/http"
	"temple-app/auth"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) AfegirExercici(c *gin.Context) {
	var rutina models.Rutina
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if rutina.EntrenadorID != auth.GetUsuari(c) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var input models.ExerciciRutinaInput

	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = h.DB.Create(&input).Error

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to aappend exercici"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": rutina})
}

func (h *Handler) LlevarExercici(c *gin.Context) {

	var rutina models.Rutina
	var err error

	if err = h.DB.Where("id = ?", c.Query("rutinaId")).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if rutina.EntrenadorID != auth.GetUsuari(c) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var exercici models.ExerciciRutina

	err = h.DB.Where("id = ?", c.Query("exerciciId")).First(&exercici).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Exercici no trobat"})
	}

	err = h.DB.Delete(&exercici).Error

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete exercici from rutina"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": rutina})
}
