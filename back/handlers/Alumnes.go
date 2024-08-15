package handlers

import (
	"net/http"
	"temple-app/auth"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) AlumnesEntrenador(c *gin.Context) {
	var entrenador models.Usuari
	var err error

	if err = h.DB.Where("id = ?", auth.GetUsuari(c)).First(&entrenador).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	if(entrenador.Alumnes == nil){
		c.JSON(http.StatusOK, gin.H{"data": []models.Usuari{}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": entrenador.Alumnes})
}