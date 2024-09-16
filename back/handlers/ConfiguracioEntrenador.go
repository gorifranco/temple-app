package handlers

import (
	"net/http"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) FindConfiguracioEntrenador(c *gin.Context) {
	var configuracio models.ConfiguracioEntrenador

	if err := h.DB.Where("entrenador_id = ?", c.Param("id")).First(&configuracio).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": configuracio})
}

func (h *Handler) GuardarConfiguracioEntrenador(c *gin.Context) {
	var configuracio models.ConfiguracioEntrenadorInput
	var err error

	if err = c.ShouldBindJSON(&configuracio); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = h.DB.Model(&models.ConfiguracioEntrenador{}).Where("entrenador_id = ?", c.MustGet("id").(uint)).
	Updates(&models.ConfiguracioEntrenador{DuracioSessions: configuracio.DuracioSessions, MaxAlumnesPerSessio: configuracio.MaxAlumnesPerSessio}).Error

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to update configuracio entrenador"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "success"})
}