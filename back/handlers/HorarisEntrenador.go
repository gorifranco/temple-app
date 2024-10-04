package handlers

import (
	"net/http"
	"temple-app/models"
	"time"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GuardarHorariEntrenador(c *gin.Context) {
	var horari []models.HorarisEntrenadorInput
	var horarisPrevis []models.HorarisEntrenador
	var newHorari []models.HorarisEntrenador

	if err := c.ShouldBindJSON(&horari); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tx := h.DB.Begin()

	err := tx.Where("entrenador_id = ?", c.MustGet("id").(uint)).Find(&horarisPrevis).Error
	if err != nil {
		tx.Rollback()
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(horarisPrevis) > 0 {
		err = tx.Delete(&horarisPrevis).Error
		if err != nil {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete previous horaris"})
			return
		}
	}
	for _, h := range horari {
		if h.DiaSetmana < 0 || h.DiaSetmana > 6 {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "DiaSetmana no vàlid"})
			return
		}

		desde, err := time.Parse("15:04", h.Desde)
		if err != nil {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Format de 'Desde' no vàlid. Ha de ser 'hh:mm'"})
			return
		}
		desde = time.Date(2000, time.January, 1, desde.Hour(), desde.Minute(), 0, 0, time.Local)

		fins, err := time.Parse("15:04", h.Fins)
		if err != nil {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Format de 'Fins' no vàlid. Ha de ser 'hh:mm'"})
			return
		}
		fins = time.Date(2000, time.January, 1, fins.Hour(), fins.Minute(), 0, 0, time.Local)

		newHorari = append(newHorari, models.HorarisEntrenador{
			EntrenadorID: c.MustGet("id").(uint),
			DiaSetmana:   h.DiaSetmana,
			Desde:        desde,
			Fins:         fins,
		})
	}

	err = tx.Create(&newHorari).Error
	if err != nil {
		tx.Rollback()
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create new horaris"})
		return
	}

	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"message": "Horaris actualitzats correctament"})
}
