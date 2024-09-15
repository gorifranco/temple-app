package handlers

import (
	"net/http"
	"temple-app/models"
	"time"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GuardarHorariEntrenador(c *gin.Context) {
	var horari []models.HorarisEntrenadorInput
	var err error
	var newHorari []models.HorarisEntrenador

	if err = c.ShouldBindJSON(&horari); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, h := range horari {
		if h.DiaSetmana < 0 || h.DiaSetmana > 6 {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Dia no vàlid"})
			return
		}
		newHorari = append(newHorari, models.HorarisEntrenador{
			DiaSetmana: h.DiaSetmana,
		})
	}

	for i, h := range horari {
		tmp, err := time.Parse("15:04", h.Desde)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Desde no vàlid"})
			return
		}
		newHorari[i].Desde = tmp
	}

	for i, h := range horari {
		tmp, err := time.Parse("15:04", h.Fins)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Fins no vàlid"})
			return
		}
		newHorari[i].Fins = tmp
	}


	err = h.DB.Create(&newHorari).Error

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create horari entrenador"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "success"})
}
